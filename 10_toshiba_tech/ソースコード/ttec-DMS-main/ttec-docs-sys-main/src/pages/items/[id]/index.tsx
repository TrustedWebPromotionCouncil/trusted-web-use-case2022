import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { BreadCrumb } from "../../../$view/components/bread-crumb"
import { Container } from "../../../$view/components/container"
import { Header } from "../../../$view/components/header"
import { useRouter } from "next/router"
import { AccordionSection } from "../../../$view/components/accordion-section"
import { HiOutlineViewGrid, HiShieldCheck, HiShieldExclamation } from 'react-icons/hi'
import { PDFViewer } from "../../../$view/components/pdf-viewer"
import Head from "next/head"
import { enforceLogin } from "../../../$server/utils/enforce-login"
import { GetDocumentQuery, useDidVerifyVcLazyQuery, useGetDocumentLazyQuery } from "../../../$view/graphql/client"
import { utcDateToLocalDate } from "../../../$view/utils/format/datetime"

export const getServerSideProps = enforceLogin

interface T {}

const ItemDetailPage: NextPage<T> = (props) => {
    const router = useRouter()
    const { id: documentId } = router.query

    const [ document, setDocument ] = useState<GetDocumentQuery['document']>()
    const [ scandata, setScandata ] = useState<string>()
    const [ isValid, setIsValid ] = useState<boolean>()
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const [ getDocument ] = useGetDocumentLazyQuery()
    const [ didVerifyVc ] = useDidVerifyVcLazyQuery()

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)

                // NOTE: 文書の取得
                const document = await getDocument({
                    variables: {
                        documentId: documentId as string,
                    }
                })

                if (! document.data) { throw new Error() }

                // VC の検証
                const verified = await didVerifyVc({
                    variables: {
                        message: document.data.document.vc,
                    }
                })

                if (! verified.data) { throw new Error() }

                setDocument(document.data.document)

                setScandata(document.data.document.data)

                setIsValid(true)
            } catch (err) {
                setIsValid(false)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    return (
        <div className="bg-gray-50">
            <Head>
                <title>文書詳細</title>
            </Head>

            <Header />

            <Container>
                <div className="mt-10">
                    <BreadCrumb
                        root={ {
                            path : '/items',
                            label: '文書管理',
                        } }
                        items={ [ {
                            path : `/items/${ documentId }`,
                            label: `${ documentId }`,
                        } ] }
                    />
                </div>

                <div className="mt-5">
                    <h2 className="font-bold text-2xl">
                        { `文書詳細` }
                    </h2>
                    <p className="text-sm mt-2">
                        { `スキャンされたデータに紐付くメタデータとスキャンデータを確認することができます。` }
                    </p>
                </div>

                <div className="mt-8 mb-40 space-y-8">
                    <AccordionSection title="検証ステータス" disabled={ true }>
                        <div className="flex flex-row text-sm text-gray-500 space-x-3">
                            { (isLoading) && (
                                <div className="flex flex-row flex-1 justify-center my-5">
                                    <HiOutlineViewGrid className="h-6 w-6 mb-0.5 mx-3 text-gray-600 animate-rotate-center" />
                                </div>
                            ) }

                            {/** 検証成功パターン */}
                            { (! isLoading && isValid === true && document) && (
                                <>
                                    <div className="flex items-center">
                                        <HiShieldCheck size={ '2.5em' } className={ 'text-green-500' } />
                                    </div>
                                    <div className="flex items-center break-all overflow-y-scroll">
                                        { document.location && document.username && (
                                            `この文書は ${ utcDateToLocalDate(document.scanedAt) } に「${ document.location }」が所有する MFP デバイス (${ document.did }) で ${ document.username } がスキャンしました。 `
                                        ) }
                                        { ! document.location && document.username && (
                                            `この文書は ${ utcDateToLocalDate(document.scanedAt) } に MFP デバイス (${ document.did }) で ${ document.username } がスキャンしました。 `
                                        ) }
                                        { document.location && ! document.username && (
                                            `この文書は ${ utcDateToLocalDate(document.scanedAt) } に「${ document.location }」が所有する MFP デバイス (${ document.did }) でスキャンしました。 `
                                        ) }
                                        { ! document.location && ! document.username && (
                                            `この文書は ${ utcDateToLocalDate(document.scanedAt) } に MFP デバイス (${ document.did }) でスキャンしました。 `
                                        ) }
                                    </div>
                                </>
                            ) }

                            {/** 検証失敗パターン */}
                            { (! isLoading && isValid === false) && (
                                <>
                                    <div className="flex items-center">
                                        <HiShieldExclamation size={ '2.5em' } className={ 'text-red-700' } />
                                    </div>
                                    <div className="flex items-center break-all overflow-y-scroll">
                                        { `文書の検証に失敗しました。文書が改ざんされている可能性があります。` }
                                    </div>
                                </>
                            ) }
                        </div>
                    </AccordionSection>

                    <AccordionSection title="スキャンデータ" disabled={ true }>
                        { (isLoading) && (
                            <div className="flex flex-row flex-1 justify-center my-5">
                                <HiOutlineViewGrid className="h-6 w-6 mb-0.5 mx-3 text-gray-600 animate-rotate-center" />
                            </div>
                        ) }

                        { (! isLoading && scandata) && (
                            <PDFViewer file={ `data:application/pdf;base64,${ scandata }` } />
                        ) }
                    </AccordionSection>
 
                    <AccordionSection title="メタデータ">
                        <div className="grid grid-cols-2 gap-5 text-sm text-gray-500">
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">文書 ID</span>
                                <span className="break-all">{ documentId }</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">DID</span>
                                <span className="break-all">{ document ? document.did : `` }</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">ファイル名</span>
                                <span className="break-all">{ document ? document.filename : `` }</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">設置場所</span>
                                { ! document && (
                                    <span className="break-all">{ '' }</span>
                                ) }
                                { document && document.location && (
                                    <span className="break-all">{ document.location }</span>
                                ) }
                                { document && ! document.location && (
                                    <span className="break-all text-gray-300">{ 'NULL' }</span>
                                ) }
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">MIME タイプ</span>
                                <span className="break-all">{ document ? document.mimeType : `` }</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">シリアル番号</span>
                                { ! document && (
                                    <span className="break-all">{ '' }</span>
                                ) }
                                { document && document.serialNumber && (
                                    <span className="break-all">{ document.serialNumber }</span>
                                ) }
                                { document && ! document.serialNumber && (
                                    <span className="break-all text-gray-300">{ 'NULL' }</span>
                                ) }
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">文書スキャン日時</span>
                                <span className="break-all">{ document ? utcDateToLocalDate(document?.scanedAt) : `` }</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <span className="font-bold">文書登録日時</span>
                                <span className="break-all">{ document ? utcDateToLocalDate(document.createdAt) : `` }</span>
                            </div>
                        </div>
                    </AccordionSection>

                    <AccordionSection title="ペイロード (VC)">
                        <div
                            className="bg-gray-100 text-gray-500 rounded-md shadow-inner px-4 py-4 h-60 break-all overflow-y-scroll monospace"
                            dangerouslySetInnerHTML={{ __html: document ? document.vc.replaceAll('-', 'ｰ') : `` }}
                        >
                        </div>
                    </AccordionSection>
                </div>
            </Container>
        </div>
    )
}

export default ItemDetailPage