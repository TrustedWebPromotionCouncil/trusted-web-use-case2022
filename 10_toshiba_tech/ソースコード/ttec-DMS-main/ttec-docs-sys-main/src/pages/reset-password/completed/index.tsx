import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { Button } from "../../../$view/components/button"
import { Container } from "../../../$view/components/container"
import { Header } from "../../../$view/components/header"
import { SplittedBox } from "../../../$view/components/splitted-box"

interface T {}

const CompletedResetPasswordPage: NextPage<T> = (props) => {
    const router = useRouter()

    const handler = () => {
        router.push('/login')
    }

    return (
        <div className="flex flex-col flex-1">
            <Head>
                <title>パスワード再設定</title>
            </Head>

            <Header />

            <Container>
                <SplittedBox>
                    <div className="flex flex-col h-full">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-2xl">
                                { `パスワード再設定` }
                            </h2>

                            <div className="space-y-4 mt-6 text-sm">
                                { `パスワードを再設定しました。ログインページへお進みください。` }
                            </div>
                        </div>

                        <div className="flex flex-col h-full justify-end items-start">
                            <Button
                                title="ログイン"
                                onClick={ handler }
                            />
                        </div>
                    </div>
                </SplittedBox>
            </Container>
        </div>
    )
}

export default CompletedResetPasswordPage