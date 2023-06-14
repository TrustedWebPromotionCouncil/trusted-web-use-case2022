import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useUser } from "../../hooks/user"

interface T {
}

export const Header: React.FC<T> = (props) => {
    const { user, signOut } = useUser()
    const router = useRouter()

    const logoutButtonHandler = async () => {
        try {
            await signOut()

            await router.push('/')
        } catch (err) {
            window.alert('ログアウトできませんでした')
        }
    }

    return (
        <div className="h-20 bg-white shadow-md flex flex-row items-center justify-between px-10">
            <h1 className="text-2xl font-black">
                <Link href={ '/' }>
                    { `文書管理システム ` }
                </Link>
            </h1>

            <div>
                { user && (
                    <button
                        className="border border-gray-300 rounded px-4 py-1 text-sm"
                        onClick={ logoutButtonHandler }
                    >
                        { `ログアウト` }
                    </button>
                ) }
            </div>
        </div>
    )
}