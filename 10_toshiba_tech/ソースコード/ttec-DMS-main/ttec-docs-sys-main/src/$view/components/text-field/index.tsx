import React, { useEffect, useState } from "react";
import { uuid } from 'uuidv4'
import { HiExclamationCircle } from 'react-icons/hi'
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface T {
    label?: string
    type?: React.HTMLInputTypeAttribute
    placeholder?: string
    error?: FieldError
    validator?: UseFormRegisterReturn<string>
}

export const TextField: React.FC<React.PropsWithChildren<T>> = (props) => {
    const [ id, setId ] = useState<string>()

    useEffect(() => {
        setId(uuid())
    }, [])

    const hasErrors = (): boolean => {
        return props.error !== undefined
    }

    return (
        <div>
            { props.label !== undefined && (
                <label
                    htmlFor={ id }
                    className='block font-bold mb-2 text-sm'
                >
                    { props.label }
                </label>
            ) }

            <input
                id={ id }
                type={ props.type ?? 'text' }
                placeholder={ props.placeholder }
                className={ [
                    'block rounded shadow px-4 py-2 w-full text-sm',
                    hasErrors() && 'border-2 border-red-800'
                ].join(' ') }

                // バリデーションルールを設定
                { ...props.validator }
            />

            { hasErrors() && (
                <div className="mt-2 rounded bg-red-50 px-4 py-3 w-full text-sm flex flex-row items-center space-x-1">
                    <span className="flex flex-row">
                        <HiExclamationCircle size={ '2em' } className='text-red-800' />
                    </span>
                    <span className="flex flex-row text-red-800 text-sm">
                        { props.error && props.error.message }
                    </span>
                </div>
            ) }
        </div>
    )
}