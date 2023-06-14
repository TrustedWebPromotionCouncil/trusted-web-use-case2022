import { Badge, Box, Button, Flex, HStack, Stack, Table as ChakraTable, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";

import { useStoredTransactions } from "../../hooks/useStoredTransactions";

export const LatestTransactionList: React.FC = () => {
  const { storedTransactions } = useStoredTransactions();
  return (
    <>
      <Box px={8} py={4}>
        <HStack justify="space-between" py={6}>
          <Text fontSize="lg" fontWeight="extrabold">
            最新5件の税務申告
          </Text>
          <Link href="/transaction/new">
            <Button variant={"solid"} bg="blue.400" color={"white"}>
              新規で税務申告
            </Button>
          </Link>
        </HStack>
        <Box bg="bg-surface">
          <Stack spacing="5">
            <Box overflowX="auto">
              <ChakraTable>
                <Tbody fontSize={14}>
                  {
                    // TODO: 連想配列は順番が保証されないので、配列での保存を検討する
                    storedTransactions.slice(0, 5).map((transaction) => (
                      <Tr key={transaction.transactionID}>
                        <Td>
                          <Badge size="sm" colorScheme={transaction.status === "申請完了" ? "green" : "yellow"}>
                            {transaction.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Link href={`/transaction/${transaction.transactionID}`}>
                            <Text color={"blue.400"} lineHeight={1.6}>
                              {transaction.title}
                            </Text>
                          </Link>
                        </Td>
                        <Td>
                          <Text>{transaction.maker}</Text>
                        </Td>
                        <Td>
                          <Text>{transaction.vendor.name}</Text>
                        </Td>
                        <Td>
                          <Text>{moment.unix(transaction.updatedAt).format("YYYY/MM/DD")}</Text>
                        </Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </ChakraTable>
            </Box>
          </Stack>
        </Box>
        <Flex justifyContent={"flex-end"} my={5}>
          <Link href="/transaction">
            <Text color="blue.400" fontSize={"14"}>
              {"すべての税務申告を見る >>"}
            </Text>
          </Link>
        </Flex>
      </Box>
    </>
  );
};
