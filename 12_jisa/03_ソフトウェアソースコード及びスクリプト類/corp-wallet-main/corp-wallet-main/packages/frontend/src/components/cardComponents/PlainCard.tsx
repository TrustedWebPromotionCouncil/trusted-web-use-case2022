import { Box, Flex, Image, Text } from "@chakra-ui/react";
import moment from "moment";
import React from "react";

import { translateText } from "../../lib/translate/translateText";
import { decodeJWTToVCData } from "../../lib/utils";
import { CardProps } from "../cardComponents/Card";

export const PlainCard: React.FC<CardProps> = ({ storedVC }) => {
  const { card } = storedVC.manifest.display;
  const decodedVC = React.useMemo(() => {
    return decodeJWTToVCData(storedVC.vc);
  }, [storedVC.vc]);
  return (
    <Box bg={card.backgroundColor} border={"2px"} borderColor={"gray.100"} rounded="2xl">
      <Flex p="6" mb="16" justifyContent="space-between" alignItems="center">
        <Image h="12" w="12" fit={"contain"} src={card.logo.uri} alt={card.logo.description} />
        <Text fontSize="xl" color={card.textColor}>
          {translateText(card.title)}
        </Text>
      </Flex>
      <Flex p="6" justifyContent="space-between" alignItems="center" margin={"0"}>
        <Text fontSize="l" color={card.textColor}>
          発行元 <br />
          {translateText(card.issuedBy)}
        </Text>
        <Box textAlign={"right"}>
          <Text color={card.textColor}>発行日: {moment.unix(decodedVC.iat).format("YYYY/MM/DD")}</Text>
          <Text color={card.textColor}>有効期限: {moment.unix(decodedVC.exp).format("YYYY/MM/DD")}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
