import { CloseIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { cleanVCRequest, getVC, StoredVC } from "../../lib/repository/vc";
import { translateText } from "../../lib/translate/translateText";
import { decodeJWTToVCData } from "../../lib/utils";
import { Card } from "../cardComponents/Card";
import { CredentialCard } from "../molecules/CredentialCard";
export interface ResultProps {
  type: "issue" | "present" | "loading";
  result: boolean;
  errorMessage: string | undefined;
  issuedCredentialID?: string;
  presentedCredentialIDs?: string[];
  nextPath?: string;
}

export const Result: React.FC<ResultProps> = ({
  type,
  result,
  errorMessage,
  issuedCredentialID,
  nextPath,
  presentedCredentialIDs,
}) => {
  const [issuedCredential, setIssuedCredential] = useState<StoredVC>(undefined);
  const [presentedCredential, setPresentedCredential] = useState<StoredVC[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (issuedCredentialID) {
      (async () => {
        const vc = await getVC(issuedCredentialID);
        setIssuedCredential(vc);
      })();
    }
    if (presentedCredentialIDs) {
      (async () => {
        const vc = await Promise.all(
          presentedCredentialIDs.map(async (id) => {
            return await getVC(id);
          })
        );
        setPresentedCredential(vc);
      })();
    }
  }, [issuedCredentialID, presentedCredentialIDs]);

  const ResultDescription = () => {
    if (type === "loading") {
      if (result) {
        return <></>;
      } else {
        return (
          <>
            <Box paddingTop={30} paddingBottom={30}>
              <Stack spacing={5}>
                <Center>
                  <CloseIcon w={20} h={20} color={"red.300"} />
                </Center>
                <Heading size={"xs"} py={5}>
                  問題が発生しました
                </Heading>
                <Text fontSize={15} color="red">
                  Error : {errorMessage}
                </Text>
              </Stack>
            </Box>
          </>
        );
      }
    }
    if (type === "issue") {
      if (result) {
        if (!issuedCredential) {
          return (
            <Box paddingTop={"20"} paddingBottom={"15"}>
              <Center>
                <Spinner />
              </Center>
            </Box>
          );
        }
        return (
          <>
            <Box>
              <Stack spacing={5}>
                <Heading size={"xs"}>証明書が発行されました</Heading>
                <Box mb="8">
                  <Card storedVC={issuedCredential} />
                </Box>
                <VStack align={"flex-start"} mb={4}>
                  <Text color="muted">発行元: {translateText(issuedCredential.manifest.display.card.issuedBy)}</Text>
                  <Text color="muted">
                    発行日: {moment.unix(decodeJWTToVCData(issuedCredential.vc).iat).format("YYYY/MM/DD")}
                  </Text>
                  <Text color="muted">
                    有効期限: {moment.unix(decodeJWTToVCData(issuedCredential.vc).exp).format("YYYY/MM/DD")}
                  </Text>
                </VStack>
                <Accordion allowToggle>
                  <AccordionItem>
                    {
                      <>
                        <h2>
                          <AccordionButton paddingLeft={0} _focus={{ boxShadow: "none" }}>
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
                                {Object.keys(decodeJWTToVCData(issuedCredential.vc).vc.credentialSubject).map((key) => (
                                  <Tr key={key}>
                                    <Td>{key}</Td>
                                    <Td>{decodeJWTToVCData(issuedCredential.vc).vc.credentialSubject[key]}</Td>
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
              </Stack>
            </Box>
          </>
        );
      } else {
        return (
          <>
            <Box paddingTop={30} paddingBottom={30}>
              <Stack spacing={5}>
                <Center>
                  <CloseIcon w={20} h={20} color={"red.300"} />
                </Center>
                <Heading size={"xs"} py={5}>
                  発行中に問題が発生しました
                </Heading>
                <Text fontSize={15} color="red">
                  Error : {errorMessage}
                </Text>
              </Stack>
            </Box>
          </>
        );
      }
    }
    if (type === "present") {
      if (result) {
        if (!presentedCredential) {
          return (
            <>
              {console.log(presentedCredential)}
              <Box paddingTop={"20"} paddingBottom={"15"}>
                <Center>
                  <Spinner />
                </Center>
              </Box>
            </>
          );
        }
        return (
          <>
            <Box>
              <Heading size={"xs"} paddingBottom={5}>
                証明書を提示しました
              </Heading>
              <Box marginBottom={3}>
                <Text>提示した証明書</Text>
              </Box>
              <Stack spacing={5}>
                {presentedCredential.map((vc) => (
                  <CredentialCard key={vc.credentialID} storedVC={vc} />
                ))}
              </Stack>
            </Box>
          </>
        );
      } else {
        return (
          <>
            <Box paddingTop={30} paddingBottom={30}>
              <Stack spacing={5}>
                <Center>
                  <CloseIcon w={20} h={20} color={"red.300"} />
                </Center>
                <Heading size={"xs"} py={5}>
                  提示中に問題が発生しました
                </Heading>
                <Text fontSize={15} color="red">
                  Error : {errorMessage}
                </Text>
              </Stack>
            </Box>
          </>
        );
      }
    }
  };

  return (
    <>
      <Box>
        {type === undefined ? (
          <Box paddingTop={"20"} paddingBottom={"15"}>
            <Center>
              <Spinner />
            </Center>
          </Box>
        ) : (
          <>
            <ResultDescription />
            <Box my={8}>
              <Button
                //mr="4"
                colorScheme="blue"
                onClick={() => {
                  cleanVCRequest();
                  router.push(nextPath ? nextPath : "/transaction");
                }}
                width={"100%"}
              >
                税務申告フローページへ
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
