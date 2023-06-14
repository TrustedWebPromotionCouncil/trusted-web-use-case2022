import Image from "next/image";
import React from "react";

interface T {}

export const SplittedBox: React.FC<React.PropsWithChildren<T>> = (props) => {
    return (
        <div className="flex flex-col flex-1 items-center justify-center overflow-hidden">
            <div className="rounded-md shadow-md overflow-hidden grid grid-cols-2 bg-white" style={{ height: '500px', width: '900px' }}>
                <Image alt="" src={ require('./assets/image.png') } className='overflow-hidden' />

                <div className="flex flex-col px-7 py-8 text-sm">
                    { props.children }
                </div>
            </div>
        </div>
    )
}