import React from "react"

interface T {
}

export const Container: React.FC<React.PropsWithChildren<T>> = (props) => {
    return (
        <div className="flex flex-col flex-1 px-10">
            { props.children }
        </div>
    )
}