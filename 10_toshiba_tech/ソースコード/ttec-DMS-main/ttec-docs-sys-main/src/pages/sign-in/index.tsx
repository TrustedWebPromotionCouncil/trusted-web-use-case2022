import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Button } from "../../$view/components/button"
import { Container } from "../../$view/components/container"
import { Header } from "../../$view/components/header"
import { SplittedBox } from "../../$view/components/splitted-box"
import { TextField } from "../../$view/components/text-field"
import { useUser } from "../../$view/hooks/user"
import { useForm } from 'react-hook-form'
import { HiExclamationCircle } from "react-icons/hi"
import { guardLogin } from "../../$server/utils/guard-login"

interface T {}

export const getServerSideProps = guardLogin

export const IDENT_RETURN_TO: string = 'returnTo'

const LoginPage: NextPage<T> = (props) => {
    const router = useRouter()

    const { signIn } = useUser()

    const { register, handleSubmit, formState, watch } = useForm<{
        email: string,
        password: string,
    }>()

    const [ error, setError ] = useState<unknown | undefined>(undefined)

    useEffect(() => {
        const subscription = watch((value) => {
            setError(undefined)
        })

        return () => subscription.unsubscribe()
    }, [ watch ])

    const handler = handleSubmit(async (fields) => {
        setError(undefined)

        try {
            // ログイン処理
            await signIn(fields.email, fields.password)

            // 呼び出し元にリダイレクト
            const returnTo = router.query[IDENT_RETURN_TO]

            if (returnTo && typeof returnTo === 'string') {
                router.push(returnTo)
            } else {
                // NOTE: 呼び出し元がない場合には /items に飛ばしてあげる
                router.push('/items')
            }
        } catch (err) {
            setError(err)
        }
    })

    return (
        <div className="flex flex-col flex-1">
            <Head>
                <title>ログイン</title>
            </Head>

            <Header />

            <Container>
                <SplittedBox>
                    <div className="flex flex-col h-full">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-2xl">
                                { `ログイン` }
                            </h2>

                            <form className="space-y-4 mt-6">
                                <TextField
                                    label={ 'メールアドレス' }
                                    placeholder={ 'user@example.com' }
                                    type={ 'email' }
                                    error={ formState.errors.email }
                                    validator={ register('email', {
                                        required: {
                                            value: true,
                                            message: '必須入力項目です',
                                        },
                                        pattern: {
                                            value: new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/),
                                            message: 'メールアドレスが正しくありません'
                                        }
                                    }) }
                                />

                                <TextField
                                    label={ 'パスワード' }
                                    placeholder={ 'password' }
                                    type={ 'password' }
                                    error={ formState.errors.password }
                                    validator={ register('password', {
                                        required: {
                                            value: true,
                                            message: '必須入力項目です',
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'パスワードは 8 文字以上です',
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'パスワードは 100 文字以内です',
                                        },
                                    }) }
                                />

                                { error !== undefined && (
                                    <div className="mt-2 rounded bg-red-50 px-4 py-3 w-full text-sm flex flex-row items-center space-x-1">
                                        <span className="flex flex-row">
                                            <HiExclamationCircle size={ '2em' } className='text-red-800' />
                                        </span>
                                        <span className="flex flex-row text-red-800 text-sm">
                                            { `ログインできませんでした` }
                                        </span>
                                    </div>
                                ) }
 
                                {/**
                                <p className="text-right">
                                    { `パスワードを忘れた場合は` } <Link href='/forgot-password' className="text-indigo-600 font-bold">こちら</Link>
                                </p>
                                */}
                            </form>
                        </div>

                        <div className="flex flex-col h-full justify-end items-start">
                            <Button
                                title="ログイン"
                                onClick={ handler }
                                disabled={ ! formState.isValid }
                            />
                        </div>
                    </div>
                </SplittedBox>
            </Container>
        </div>
    )
}

export default LoginPage