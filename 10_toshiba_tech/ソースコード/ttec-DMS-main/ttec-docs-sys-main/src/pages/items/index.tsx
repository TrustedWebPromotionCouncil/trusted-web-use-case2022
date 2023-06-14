import { NextPage } from "next"
import React, { useEffect, useState } from "react"
import { BreadCrumb } from "../../$view/components/bread-crumb"
import { Container } from "../../$view/components/container"
import { Header } from "../../$view/components/header"
import { HiChevronRight, HiTrash, HiOutlineViewGrid } from 'react-icons/hi'
import { useRouter } from "next/router"
import Head from "next/head"
import { enforceLogin } from "../../$server/utils/enforce-login"
import { GetDocumentsQuery, useGetDocumentsLazyQuery, useRemoveDocumentMutation } from "../../$view/graphql/client"
import { utcDateToLocalDate } from "../../$view/utils/format/datetime"

export const getServerSideProps = enforceLogin

interface T {}

const ItemsPage: NextPage<T> = (props) => {
    const router = useRouter()

    // const [ documents, setDocuments ] = useState<GetDocumentsQuery['documents']>([])
    const [ removeItems, setRemoveItems ] = useState<Array<string>>([])
    const [ removeLoading, setRemoveLoading ] = useState<boolean>(false)

    const [ getDocuments, { data: documents, refetch: refetchGetDocuments  } ] = useGetDocumentsLazyQuery()
    const [ removeDocument ] = useRemoveDocumentMutation()

    const handler = (documentId: string) => {
        router.push(`/items/${ documentId }`)
    }

    useEffect(() => {
        (async () => { await getDocuments() })()
    }, [])

    const removeAllRowHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (! documents) { return }

        const checked = event.target.checked

        if (checked) {
            setRemoveItems(documents.documents.map((row) => row.id))
        } else {
            setRemoveItems([])
        }
    }

    const removeRowHandler = (event: React.ChangeEvent<HTMLInputElement>, row: GetDocumentsQuery['documents'][number]) => {
        const checked = event.target.checked

        if (checked) {
            const arr = Array.from(removeItems)

            if (arr.indexOf(row.id) < 0) { arr.push(row.id) }

            setRemoveItems(arr)
        } else {
            const arr: Array<string> = []

            removeItems.forEach((item) => {
                if (item !== row.id) { arr.push(item) }
            })

            setRemoveItems(arr)
        }
    }

    const removeHandler = async () => {
        const confirmed = window.confirm(`選択された${ removeItems.length }件の電子化文書を削除します。削除後にデータを復旧することはできません。削除してもよろしいですか？`)

        if (! confirmed) {
            return
        }

        try {
            setRemoveLoading(true)

            await Promise.all(removeItems.map((item) => {
                return removeDocument({ variables: { documentId: item }})
            }))
            await refetchGetDocuments()

            setRemoveItems([])
        } catch {
        } finally {
            setRemoveLoading(false)
        }
    }

    return (
        <div className="bg-gray-50">
            <Head>
                <title>文書管理</title>
            </Head>

            <Header />

            <Container>
                <div className="mt-10">
                    <BreadCrumb
                        root={ {
                            path : '/items',
                            label: '文書管理',
                        } }
                        items={ [] }
                    />
                </div>

                <div className="mt-5">
                    <h2 className="font-bold text-2xl">
                        { `文書管理` }
                    </h2>
                    <p className="text-sm mt-2">
                        { `スキャンされたデータを蓄積・データに紐付くメタデータを確認することができます。` }
                    </p>
                </div>

                <div className="mt-8 mb-10 text-sm rounded-md shadow overflow-hidden">
                    <div className="bg-gray-100 px-3 pt-3 flex flex-row items-center space-x-7 h-12">
                        <input
                            type={ 'checkbox' }
                            className="w-4 h-4 mb-0.5 rounded border-gray-300 bg-gray-50"
                            onChange={ (event) => removeAllRowHandler(event) }
                            checked={
                                documents && documents.documents.map((r) => r.id).every(item => removeItems.includes(item)) &&
                                removeItems.every(item => documents.documents.map((r) => r.id).includes(item))
                            }
                            disabled={ removeLoading }
                        />
                        { 0 < removeItems.length && (
                            <button
                                className="flex flex-row items-center rounded-md bg-gray-200 h-full"
                                disabled={ removeLoading }
                                onClick={ removeHandler }
                            >
                                { ! removeLoading && (
                                    <HiTrash className="h-6 w-6 mb-0.5 mx-3 text-gray-600" />
                                ) }
                                { removeLoading && (
                                    <HiOutlineViewGrid className="h-6 w-6 mb-0.5 mx-3 text-gray-600 animate-rotate-center" />
                                ) }
                            </button>
                        ) }
                    </div>
                    <table className="table-auto w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="py-3 px-3" colSpan={2}>{ `文書 ID` }</th>
                                <th className="py-3 px-3">{ `設置場所` }</th>
                                <th className="py-3 px-3">{ `ファイル名` }</th>
                                <th className="py-3 px-3">{ `スキャン日時` }</th>
                                <th className="py-3 px-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            { documents && documents.documents.map((row, index) => {
                                return (
                                    <tr key={ `${ index }` }>
                                        <td className="border-t px-3 w-6 border-r border-r-gray-50">
                                            <input
                                                type={ 'checkbox' }
                                                className="w-4 h-4 mb-0.5 rounded border-gray-300 bg-gray-50"
                                                onChange={ (event) => { removeRowHandler(event, row) } }
                                                checked={ 0 <= removeItems.indexOf(row.id) }
                                                disabled={ removeLoading }
                                            />
                                        </td>
                                        <td onClick={ () => { handler(row.id) } } className="border-t py-3 px-3 cursor-pointer">
                                            { row.id }
                                        </td>
                                        <td onClick={ () => { handler(row.id) } } className="border-t py-3 px-3 cursor-pointer">
                                            { row.location || '' }
                                        </td>
                                        <td onClick={ () => { handler(row.id) } } className="border-t py-3 px-3 cursor-pointer">
                                            { row.filename }
                                        </td>
                                        <td onClick={ () => { handler(row.id) } } className="border-t py-3 px-3 cursor-pointer">
                                            { utcDateToLocalDate(row.scanedAt) }
                                        </td>
                                        <td onClick={ () => { handler(row.id) } } className="border-t px-3 w-2 cursor-pointer">
                                            <span className="flex flex-row justify-end">
                                                <HiChevronRight size={ '1.75em' } className='text-gray-700' />
                                            </span>
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                </div>

                {/** TODO: ページネーションの実装 */}
                {/**
                <div className="mt-8 flex flex-col items-center">
                    <div className="flex flex-row rounded border bg-white">
                        { Array.from(Array(5).keys()).map((index) => {
                            return (
                                <Link href={ '#' } key={ `${ index }` } className={ [ "px-5 py-3", index !== 0 && 'border-l' ].join(' ') }>
                                    { index + 1 }
                                </Link>
                            )
                        }) }
                    </div>
                </div>
                */}
            </Container>
        </div>
    )
}

export default ItemsPage