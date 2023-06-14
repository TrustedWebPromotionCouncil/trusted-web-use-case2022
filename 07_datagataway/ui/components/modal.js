
import { Modal, Button, Text, Loading } from "@nextui-org/react";


export function ModalOk({ title, body, bindings, close, pre }) {
    return (
        <Modal id="modal-ok" css={{minWidth: "800px"}} width={800} scroll {...bindings}>
            <Modal.Header>
                <Text id="modal-title" size={18}>{title}</Text>
            </Modal.Header>
            <Modal.Body>
                {body ?
                    <Text size={12}>
                        <pre style={{fontSize:'12px'}}>
                        {body}
                        </pre>
                    </Text>
                    :
                    <Loading />
                }
            </Modal.Body>
            <Modal.Footer>
                <Button auto onPress={close}>Close</Button>
            </Modal.Footer>
        </Modal> 
    )
}

