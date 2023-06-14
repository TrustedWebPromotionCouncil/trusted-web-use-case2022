import { NextPage } from 'next'
import { useState } from 'react'
import { useDidCommGenerateEncryptedMessageLazyQuery, useDidCommVerifyEncryptedMessageLazyQuery } from '../../$view/graphql/client'

interface T {}

const InternalPage: NextPage<T> = () => {
    const [ destination, setDestination ] = useState<string>('')
    const [ message1, setMessage1 ] = useState<string>('')
    const [ message2, setMessage2 ] = useState<string>('')
    const [ result, setResult ] = useState<string>()

    const [ generateEncryptedMessage ] = useDidCommGenerateEncryptedMessageLazyQuery()
    const [ verifyEncryptedMessage ] = useDidCommVerifyEncryptedMessageLazyQuery()

    const generate = async () => {
        try {
            const res = await generateEncryptedMessage({
                variables: {
                    destinations: [ destination ],
                    message: JSON.stringify({
                        data: message1,
                    })
                }
            })

            if (res.data) {
                setResult(res.data.didcommGenerateEncryptedMessage)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const verify = async () => {
        try {
            const res = await verifyEncryptedMessage({
                variables: {
                    message: message2,
                }
            })

            if (res.data) {
                setResult(res.data.didcommVerifyEncryptedMessage)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='m-10'>
            <div>
                { `Generate DIDComm Enc` }
            </div>
            <form>
                <div>
                    <input
                        type={ 'text' }
                        value={ destination }
                        placeholder={ 'destination' }
                        onChange={ (event) => {
                            setDestination(event.target.value)
                        } }
                    />
                    <br />
                    <input
                        type={ 'text' }
                        value={ message1 }
                        placeholder={ 'message' }
                        onChange={ (event) => {
                            setMessage1(event.target.value)
                        } }
                    />
                </div>
                <div>
                    <button
                        type='button'
                        onClick={ generate }
                    >
                        { `generate` }
                    </button>
                </div>
            </form>

            <form>
                <div>
                    <input
                        type={ 'text' }
                        value={ message2 }
                        placeholder={ 'message' }
                        onChange={ (event) => {
                            setMessage2(event.target.value)
                        } }
                    />
                </div>
                <div>
                    <button
                        type='button'
                        onClick={ verify }
                    >
                        { `verify` }
                    </button>
                </div>
            </form>

            { result && (
                <pre className='overflow-scroll'>
                    { result }
                </pre>
            ) }
        </div>
    )
}

export default InternalPage