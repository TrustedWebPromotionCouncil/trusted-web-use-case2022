import { NextPage } from "next"
import Head from "next/head"
import React from "react"
import { Container } from "../../../$view/components/container"
import { Header } from "../../../$view/components/header"
import { SplittedBox } from "../../../$view/components/splitted-box"

interface T {}

const CompletedForgotPasswordPage: NextPage<T> = (props) => {
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
                                { `メールアドレス宛にパスワード再設定用のリンクを送信しました。` }
                            </div>
                        </div>

                        <div className="flex flex-col h-full justify-end items-start">
                        </div>
                    </div>
                </SplittedBox>
            </Container>
        </div>
    )
}

export default CompletedForgotPasswordPage