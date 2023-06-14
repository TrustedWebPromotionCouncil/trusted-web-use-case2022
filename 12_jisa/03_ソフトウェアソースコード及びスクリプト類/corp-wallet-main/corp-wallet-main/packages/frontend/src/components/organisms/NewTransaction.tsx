import { Box, Button, FormControl, FormHelperText, FormLabel, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";

import { selectableTransactions } from "../../fixtures";
import { Actor, saveNewTransaction, StoredTransaction } from "../../lib/repository/transaction";

const CONSTANT_ACTOR_DATA = {
  industryAssociation: {
    name: "情報サービス産業協会(JISA)",
    url: "https://www.jisa.or.jp/",
    credentialIssuerUrl: "https://vc-issuer-jisa.azurewebsites.net/issuer",
  },
  theSmallAndMediumEnterpriseAgency: {
    name: "所管官庁(当該中小事業者の業種所管)",
    url: "https://www.meti.go.jp/",
    credentialIssuerUrl: "https://vc-issuer-agency.azurewebsites.net/issuer",
  },
};

export const NewTransaction: React.FC = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<{
    value: string;
    label: string;
    maker: string;
    vendor: Actor;
  }>({
    value: "",
    label: "",
    maker: "",
    vendor: {
      name: "",
      url: "",
      credentialIssuerUrl: "",
    },
  });

  const hundleClick = async () => {
    const transaction: StoredTransaction = {
      title: selected?.label,
      status: "ソフトウェア利用証明書取得待ち",
      maker: selected?.maker,
      updatedAt: moment().unix(),
      vendor: selected?.vendor,
      ...CONSTANT_ACTOR_DATA,
    };
    const transactionID = await saveNewTransaction(transaction);
    router.push(`/transaction/${transactionID}`);
  };

  return (
    <Box px={8} py={4} pb={10}>
      <HStack justify="space-between" py={6}>
        <Text fontSize="lg" fontWeight="extrabold">
          新しい税務申告
        </Text>
      </HStack>
      <VStack spacing={8} align="flex-start">
        <FormControl>
          <FormLabel>購入品名</FormLabel>
          <Select
            id="selectbox"
            instanceId="selectbox"
            placeholder="Select option"
            options={selectableTransactions}
            onChange={(e: any) => setSelected(e)}
          />
          <FormHelperText>購入品名を入力してください。</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>メーカー名</FormLabel>
          <Input color={"black.500"} readOnly type="text" value={selected?.maker} />
          <FormHelperText>購入品名から自動で入力されます</FormHelperText>
        </FormControl>
        <Button
          variant={"solid"}
          isDisabled={selected?.value === ""}
          colorScheme="teal"
          onClick={async () => {
            await hundleClick();
          }}
        >
          税務申告のフローを開始する
        </Button>
      </VStack>
    </Box>
  );
};
