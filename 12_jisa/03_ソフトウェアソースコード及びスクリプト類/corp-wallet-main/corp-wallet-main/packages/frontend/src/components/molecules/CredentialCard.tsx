import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Square,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { FiFileText } from "react-icons/fi";

import { StoredVC } from "../../lib/repository/vc";
import { translateText } from "../../lib/translate/translateText";
import { decodeJWTToVCData } from "../../lib/utils";
import { PlainCard } from "../cardComponents/PlainCard";

interface CredentialCardProps {
  storedVC: StoredVC;
}

// TODO: 関連するトランザクションを表示する
export const CredentialCard: React.FC<CredentialCardProps> = ({ storedVC }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { manifest, credentialSubject, relatedTransactions, vcHistory, credentialID } = storedVC;

  // TODO: decodeは事前にしてバックエンドにdecode済みのデータを保存するようにする
  const decodedVC = React.useMemo(() => {
    return decodeJWTToVCData(storedVC.vc);
  }, [storedVC.vc]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{translateText(manifest.display.card.title)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box paddingX={5} paddingBottom={30}>
              <PlainCard storedVC={storedVC} />
            </Box>
            {/* <VStack align={"flex-start"} mb={4}>
              <Text color="muted">発行元: {translateText(manifest.display.card.issuedBy)}</Text>
              <Text color="muted">発行日: {moment.unix(decodedVC.iat).format("YYYY/MM/DD")}</Text>
              <Text color="muted">有効期限: {moment.unix(decodedVC.exp).format("YYYY/MM/DD")}</Text>
            </VStack> */}
            <Accordion allowToggle>
              <AccordionItem>
                {
                  <>
                    <h2>
                      <AccordionButton _focus={{ boxShadow: "none" }}>
                        <Box as="span" flex="1" textAlign="left">
                          <Text color="muted">属性詳細</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel padding={0}>
                      <TableContainer>
                        <Table variant="simple" size={"sm"}>
                          <Thead>
                            <Tr>
                              <Th>プロパティ</Th>
                              <Th>値</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {Object.keys(credentialSubject).map((key) => (
                              <Tr key={key}>
                                <Td>{key}</Td>
                                <Td>{storedVC.credentialSubject[key]}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </>
                }
              </AccordionItem>
            </Accordion>
            <Text fontSize="sm" fontWeight="bold" mt={10} mb={4}>
              関連する税務申告
            </Text>
            <Box borderWidth={{ base: "0", md: "1px" }} p={{ base: "0", md: "4" }} borderRadius="lg">
              {relatedTransactions?.map((relatedTransaction) => {
                return (
                  <div key={relatedTransaction.transactionID}>
                    <Stack justify="space-between" direction={{ base: "column", md: "row" }} spacing="5">
                      <HStack spacing="3">
                        <Box fontSize="sm">
                          <Text color="empahsized" fontWeight="bold">
                            税務申告: ID {relatedTransaction.transactionID}
                          </Text>
                          <Text color="muted">{relatedTransaction.title}</Text>
                        </Box>
                      </HStack>
                      <Stack spacing="3" direction={{ base: "column-reverse", md: "row" }}>
                        <Link href={`/transaction/${relatedTransaction.transactionID}`}>
                          <Button variant="primary">詳細</Button>
                        </Link>
                      </Stack>
                    </Stack>
                  </div>
                );
              })}
            </Box>
            <Text fontSize="sm" fontWeight="bold" mt={10} mb={4}>
              履歴
            </Text>
            <Box borderWidth={{ base: "0", md: "1px" }} p={{ base: "0", md: "4" }} borderRadius="lg">
              {vcHistory?.map((history) => {
                return (
                  <div key={history.timestamp}>
                    <Stack justify="space-between" direction={{ base: "column", md: "row" }} spacing="5">
                      <HStack spacing="3">
                        <Box fontSize="sm">
                          <Text>{moment.unix(history.timestamp).format("YYYY/MM/DD HH:mm")} </Text>
                          <Text color="empahsized" fontWeight="bold">
                            {history.message}
                          </Text>
                        </Box>
                      </HStack>
                    </Stack>
                  </div>
                );
              })}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box borderWidth={{ base: "0", md: "1px" }} p={{ base: "0", md: "4" }} borderRadius="lg">
        <Stack justify="space-between" direction={{ base: "column", md: "row" }} spacing="5">
          <HStack spacing="3">
            <Square size="10" bg="bg-subtle" borderRadius="lg">
              <Icon as={FiFileText} boxSize="5" />
            </Square>
            <Box fontSize="sm">
              <Text color="empahsized" fontWeight="bold">
                {translateText(manifest.display.card.title)}
              </Text>
              <Text color="muted">証明書ID: {credentialID}</Text>
              <Text color="muted">発行元: {translateText(manifest.display.card.issuedBy)}</Text>
              <Text color="muted">発行日: {moment.unix(decodedVC.iat).format("YYYY/MM/DD")}</Text>
              <Text color="muted">有効期限: {moment.unix(decodedVC.exp).format("YYYY/MM/DD")}</Text>
            </Box>
          </HStack>
          <Stack spacing="3" direction={{ base: "column-reverse", md: "row" }}>
            <Button variant="primary" onClick={onOpen}>
              詳細
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
