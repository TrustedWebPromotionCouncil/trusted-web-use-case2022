import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { Button } from "../../$view/components/button"
import { Container } from "../../$view/components/container"
import { Header } from "../../$view/components/header"
import { SplittedBox } from "../../$view/components/splitted-box"
import { TextField } from "../../$view/components/text-field"

interface T {}

const ResetPasswordPage: NextPage<T> = (props) => {
    const router = useRouter()

    const handler = () => {
        router.push('/reset-password/completed')
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

                            <form className="space-y-4 mt-6">
                                <TextField
                                    label={ 'パスワード' }
                                    placeholder={ 'password' }
                                    type={ 'password' }
                                />

                                <TextField
                                    label={ 'パスワード (確認)' }
                                    placeholder={ 'password' }
                                    type={ 'password' }
                                />
                            </form>
                        </div>

                        <div className="flex flex-col h-full justify-end items-start">
                            <Button
                                title="次へ"
                                onClick={ handler }
                            />
                        </div>
                    </div>
                </SplittedBox>
            </Container>
        </div>
    )
}

export default ResetPasswordPage