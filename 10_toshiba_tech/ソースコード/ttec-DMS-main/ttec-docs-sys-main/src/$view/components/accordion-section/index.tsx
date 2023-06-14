import React, { useState } from "react";
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

interface T {
    title: string
    disabled?: boolean
}

export const AccordionSection: React.FC<React.PropsWithChildren<T>> = (props) => {
    const [ open, setOpen ] = useState<boolean>(false)

    const disabled = (): boolean => {
        if (props.disabled === undefined) {
            return false
        }

        return props.disabled
    }

    return (
        <div className="flex flex-col rounded-md shadow overflow-hidden bg-white">
            <div
                className={ [ "flex flex-row px-5 py-3 items-center justify-between", (! disabled()) && 'cursor-pointer' ].join(' ') }
                onClick={ () => {
                    setOpen(! open)
                } }
            >
                <h3 className="text-base font-bold">
                    { props.title }
                </h3>

                { (! disabled() && open) && (
                    <span>
                        <HiChevronDown size={ '1.5em' } className='text-gray-700' />
                    </span>
                ) }
                { (! disabled() && ! open) && (
                    <span>
                        <HiChevronUp size={ '1.5em' } className='text-gray-700' />
                    </span>
                ) }
            </div>

            { disabled() && (
                <div className="flex flex-col px-5 py-5 text-sm border-t">
                    { props.children }
                </div>
            ) }

            { (! disabled() && open) && (
                <div className="flex flex-col px-5 py-5 text-sm border-t">
                    { props.children }
                </div>
            ) }
        </div>
    )
}