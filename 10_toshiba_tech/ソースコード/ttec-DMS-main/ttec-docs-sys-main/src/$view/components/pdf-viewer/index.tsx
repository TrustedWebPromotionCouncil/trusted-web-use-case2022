import React, { useEffect, useState } from "react";

import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorkerSrc from '../../../pdf-worker'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Button } from "../button"
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

interface T {
    file: string
}

export const PDFViewer: React.FC<React.PropsWithChildren<T>> = (props) => {
    const [ numPages, setNumPages ] = useState<number>(0)
    const [ pageNumber, setPageNumber ] = useState<number>(1)

    const onDocumentLoadSuccess = ({ numPages } : { numPages: number }) => {
        setNumPages(numPages)
    }

    return (
        <div className="flex flex-col">
            <Document
                file={ props.file }
                onLoadSuccess={ onDocumentLoadSuccess }
                className='rounded-md shadow-inner flex flex-col items-center bg-gray-100 py-4 px-4'
                renderMode='canvas'
            >
                <div className="w-full h-96 overflow-scroll flex flex-row justify-center">
                    <Page pageNumber={ pageNumber } />
                </div>
            </Document>

            <div className="text-sm mt-4 mb-4 flex flex-col">
                <div className="flex flex-row justify-center items-center space-x-5">
                    <Button
                        onClick={ () => {
                            setPageNumber(pageNumber - 1)
                        } }
                        title={ '前ページ' }
                        disabled={ pageNumber <= 1 }
                    />
                    <div>
                        { `${ pageNumber } / ${ numPages } ページ` }
                    </div>
                    <Button
                        onClick={ () => {
                            setPageNumber(pageNumber + 1)
                        } }
                        title={ '次ページ' }
                        disabled={ numPages <= pageNumber }
                    />
                </div>
            </div>
        </div>
    )
}