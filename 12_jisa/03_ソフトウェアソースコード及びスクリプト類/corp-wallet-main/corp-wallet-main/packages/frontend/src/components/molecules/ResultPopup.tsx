import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Modal, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, VStack } from "@chakra-ui/react";
interface ResultPopupProps {
  result: undefined | "success" | "faild";
  isOpen: boolean;
  onClose: () => void;
}

export const ResultPopup: React.FC<ResultPopupProps> = ({ result, isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {result === undefined ? (
            <Spinner />
          ) : (
            <>
              <ModalHeader></ModalHeader>
              <Box h={300}>
                <Center h={300}>
                  {result === "success" ? (
                    <>
                      <VStack spacing={8}>
                        <CheckCircleIcon w={20} h={20} color={"blue.300"} />
                        <Text fontSize="xl">成功しました</Text>
                      </VStack>
                    </>
                  ) : (
                    <>
                      <VStack spacing={8}>
                        <CloseIcon w={20} h={20} color={"red.300"} />
                        <Text fontSize="xl">失敗しました</Text>
                      </VStack>
                    </>
                  )}
                </Center>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
