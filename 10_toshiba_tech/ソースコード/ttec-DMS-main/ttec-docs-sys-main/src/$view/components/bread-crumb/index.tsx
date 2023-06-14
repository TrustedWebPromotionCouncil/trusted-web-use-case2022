import Link from "next/link";
import React from "react";
import { HiChevronRight } from 'react-icons/hi'

interface Item {
    label: string
    path: string
}

interface T {
    root: Item
    items: Array<Item>
}

export const BreadCrumb: React.FC<React.PropsWithChildren<T>> = (props) => {
    return (
        <div className="flex flex-row text-sm space-x-2 items-center">
            <span className="flex flex-row font-bold">
                <Link href={ props.root.path }>
                    { props.root.label }
                </Link>
            </span>

            <span className="flex flex-row">
                <HiChevronRight size={ '1.75em' } style={{ marginTop: 2 }} />
            </span>

            { props.items && 0 < props.items.length && (
                props.items.map((item, index) => {
                    return (
                        <div key={ `${ index }` }>
                            { index !== 0 && (
                                <span className="flex flex-row">
                                    <HiChevronRight size={ '1.75em' } style={{ marginTop: 2 }} />
                                </span>
                            ) }

                            <span className="flex flex-row">
                                <Link href={ item.path }>
                                    { item.label }
                                </Link>
                            </span>
                        </div>
                    )
                })
            ) }
        </div>
    )
}