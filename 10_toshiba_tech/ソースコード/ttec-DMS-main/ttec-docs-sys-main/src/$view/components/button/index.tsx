import React from "react";

interface T {
    title: string
    disabled?: boolean
    onClick: () => void
}

export const Button: React.FC<React.PropsWithChildren<T>> = (props) => {
    return (
        <button
            type='button'
            onClick={ () => {
                props.onClick()
            } }
            className={ [
                'text-white text-sm rounded-md px-7 py-2',
                (props.disabled) && 'bg-indigo-200',
                (! props.disabled) && 'bg-indigo-600',
            ].join(' ') }
            disabled={ props.disabled }
        >
            { `${ props.title }` }
        </button>
    )
}