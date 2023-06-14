import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  BoxProps,
  Button,
  Circle,
  Divider,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SquareProps,
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
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { HiCheck, HiCheckCircle } from "react-icons/hi";

import { useStoredTransactions } from "../../hooks/useStoredTransactions";
import { Actor, StoredTransaction } from "../../lib/repository/transaction";
import { getVC, StoredVC } from "../../lib/repository/vc";
import { translateText } from "../../lib/translate/translateText";
import { decodeJWTToVCData, VCData } from "../../lib/utils";
import { PlainCard } from "../cardComponents/PlainCard";

export const steps = [
  {
    title: "1: ソフトウェア利用証明書を発行",
    description: "メーカーサイトに遷移し、ソフトウェア利用証明書の発行をしてください。",
    action: "メーカーサイトへ",
  },
  {
    title: "2: 工業会証明書を発行",
    description: "対象設備の証明書を交付する工業会サイトに遷移し、工業会証明書の発行をしてください。",
    action: "JISAホームページへ",
    requirements: ["ソフトウェア利用証明書"],
  },
  {
    title: "3: 経営力向上計画の申請",
    description: "経営力向上計画の申請を行います。ステップ２で取得した証明書が必要です。",
    action: "申請ページへ",
    requirements: ["ソフトウェア利用証明書", "工業会証明書"],
  },
  {
    title: "4: 税務署への申告",
    description: "取得したすべての証明書を税務署へ提出してください。",
    action: "税務署ホームページへ",
    requirements: ["ソフトウェア利用証明書", "工業会証明書", "経営力向上計画認定証明書"],
  },
  {
    title: "5: 申請完了",
    description: "税務署への申告が完了しました。",
    action: "ホームへ",
  },
];

export const Transaction = () => {
  const router = useRouter();
  const { transactionID } = router.query;
  const [transaction, setTransaction] = useState<StoredTransaction | undefined>();
  const { storedTransactions } = useStoredTransactions(transactionID as string);

  useEffect(() => {
    setTransaction(storedTransactions[0]);
  }, [storedTransactions]);

  const currentStep = () => {
    if (!transaction) return 0;
    {
      if (transaction.vendor.credential) {
        if (transaction.industryAssociation.credential) {
          if (transaction.theSmallAndMediumEnterpriseAgency.credential) {
            if (transaction.status == "申請完了") {
              return 4;
            }
            return 3;
          }
          return 2;
        }
        return 1;
      }
      return 0;
    }
  };

  const transactionDataAtSteps: Actor[] = useMemo(() => {
    if (!transaction) return [];
    return [
      transaction.vendor,
      transaction.industryAssociation,
      transaction.theSmallAndMediumEnterpriseAgency,
      {
        name: "税務署",
        url: "https://www.nta.go.jp/",
        credentialIssuerUrl: "https://vc-verify-taxoffice.azurewebsites.net/verifier",
      },
      {
        name: "Home",
        url: "/",
        credentialIssuerUrl: "/",
      },
    ];
  }, [transaction]);

  // TODO: 強引にやっているので、もっと良い方法を考える
  const stepsWithRequirementsVCIDs = {
    1: [transaction?.vendor.credential?.credentialID],
    2: [transaction?.vendor.credential?.credentialID, transaction?.industryAssociation.credential?.credentialID],
    3: [
      transaction?.vendor.credential?.credentialID,
      transaction?.industryAssociation.credential?.credentialID,
      transaction?.theSmallAndMediumEnterpriseAgency.credential?.credentialID,
    ],
  };

  return (
    <>
      {transaction && (
        <Box px={8} py={4} pb={10}>
          <HStack justify="space-between" py={6}>
            <Text fontSize="lg" fontWeight="extrabold">
              税務申告 (ID: {transactionID})
              <br />
              {transaction.vendor.name} {transaction.title}
              <br />
              <Badge size="sm" colorScheme={transaction.status === "申請完了" ? "green" : "yellow"}>
                {transaction.status}
              </Badge>
            </Text>
          </HStack>
          <Box bg="bg-surface">
            <Stack spacing="0">
              {steps.map((step, id) => (
                <Step
                  key={id}
                  cursor="pointer"
                  title={step.title}
                  description={step.description}
                  action={step.action}
                  requirements={step.requirements}
                  isActive={currentStep() === id}
                  isCompleted={currentStep() > id}
                  isLastStep={steps.length === id + 1}
                  transactionDataAtStep={transactionDataAtSteps[id]}
                  transactionID={transaction.transactionID}
                  stepsWithRequirementsVCID={stepsWithRequirementsVCIDs[id]}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

interface StepProps extends BoxProps {
  title: string;
  description: string;
  action: string;
  requirements?: string[];
  isCompleted: boolean;
  isActive: boolean;
  isLastStep: boolean;
  transactionDataAtStep: Actor;
  transactionID: string;
  stepsWithRequirementsVCID: string[];
}

export const Step: React.FC<StepProps> = ({
  title,
  description,
  action,
  requirements,
  isActive,
  isCompleted,
  isLastStep,
  transactionDataAtStep,
  transactionID,
  stepsWithRequirementsVCID,
}) => {
  const router = useRouter();

  return (
    <Stack spacing="4" direction="row">
      <Stack spacing="0" align="center">
        <StepCircle isActive={isActive} isCompleted={isCompleted} />
        <Divider
          orientation="vertical"
          borderWidth="1px"
          borderColor={isCompleted ? "accent" : isLastStep ? "transparent" : "inherit"}
        />
      </Stack>
      <VStack spacing="1" pb={isLastStep ? "0" : "8"} align="flex-start">
        <Text color="emphasized" fontWeight="extrabold">
          {title}
        </Text>
        <Text color="muted">{description}</Text>
        <Button
          variant={"solid"}
          colorScheme="teal"
          fontWeight="extrabold"
          disabled={!isActive}
          onClick={() => router.push(transactionDataAtStep.credentialIssuerUrl + `?transactionID=${transactionID}`)}
        >
          {action}
        </Button>

        <Flex pt={4} flexWrap="wrap">
          {stepsWithRequirementsVCID &&
            stepsWithRequirementsVCID.map((credentialID, id) => (
              <HStack key={id}>
                <RequirementVCButton
                  credentialID={credentialID}
                  requirementVCName={requirements[id]}
                  isActive={isActive}
                  isCompleted={isCompleted}
                />
              </HStack>
            ))}
        </Flex>
      </VStack>
    </Stack>
  );
};

interface RequirementVCButtonProps {
  credentialID?: string;
  requirementVCName: string;
  isActive: boolean;
  isCompleted: boolean;
}

const RequirementVCButton: React.FC<RequirementVCButtonProps> = ({
  credentialID,
  isActive,
  isCompleted,
  requirementVCName,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [storedVC, setStoredVC] = useState<StoredVC | undefined>();
  const [decodedVC, setDecodedVC] = useState<VCData | undefined>();

  useEffect(() => {
    if (!credentialID) return;
    (async () => {
      const vc = await getVC(credentialID);
      setStoredVC(vc);
      setDecodedVC(decodeJWTToVCData(vc.vc));
    })();
  }, [credentialID]);

  return (
    <>
      {storedVC && decodedVC && (
        <>
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{translateText(storedVC.manifest.display.card.title)}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box paddingX={5} paddingBottom={30}>
                  <PlainCard storedVC={storedVC} />
                </Box>
                {/* <VStack align={"flex-start"} mb={4}>
                  <Text color="muted">発行元: {storedVC.manifest.display.card.issuedBy}</Text>
                  <Text color="muted">発行日: {moment.unix(decodedVC.iat).format("YYYY/MM/DD")}</Text>
                  <Text color="muted">有効期限: {moment.unix(decodedVC.exp).format("YYYY/MM/DD")}</Text>
                </VStack> */}
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
                                {Object.keys(storedVC.credentialSubject).map((key) => (
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
                  {storedVC.relatedTransactions?.map((relatedTransaction) => {
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
                  {storedVC.vcHistory?.map((history) => {
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
        </>
      )}
      <HStack
        borderRadius={20}
        border={"solid 1px black"}
        borderColor={isActive || isCompleted ? "accent" : "gray.200"}
        py={2}
        px={4}
        mr="2"
        mb={2}
        onClick={() => {
          if (isActive || isCompleted) onOpen();
        }}
      >
        <Icon as={HiCheckCircle} color={isActive || isCompleted ? "accent" : "gray.200"} />
        <Text color={isActive || isCompleted ? "accent" : "gray.200"}>{requirementVCName}</Text>
      </HStack>
    </>
  );
};

interface RadioCircleProps extends SquareProps {
  isCompleted: boolean;
  isActive: boolean;
}

export const StepCircle: React.FC<RadioCircleProps> = ({ isCompleted, isActive }) => {
  return (
    <Circle
      size="8"
      bg={isCompleted ? "accent" : "inherit"}
      borderWidth={isCompleted ? "0" : "2px"}
      borderColor={isActive ? "accent" : "inherit"}
    >
      {isCompleted ? (
        <Icon as={HiCheck} color="inverted" boxSize="5" />
      ) : (
        <Circle bg={isActive ? "accent" : "border"} size="3" />
      )}
    </Circle>
  );
};
