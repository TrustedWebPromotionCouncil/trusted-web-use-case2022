import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Link,
  Progress,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { present } from "../../lib/present";
import { Signer } from "../../lib/signer";
import { translateText } from "../../lib/translate/translateText";
import { VCRequest } from "../../types";
import { SelectVC } from "../molecules/PresentationSelectVC";
import { ResultPopup } from "../molecules/ResultPopup";

export interface PresentProps {
  vcRequest: VCRequest;
}

export const Present: React.FC<PresentProps> = ({ vcRequest }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [issueResult, setIssueResult] = React.useState<undefined | "success" | "faild">(undefined);
  const [presentationVCIDs, setPresentationVCIDs] = React.useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const presentVC = async () => {
    setIsLoading(true);
    /** VCにexchangeServiceがある場合 VC exchangeをする */
    const signer = new Signer();
    try {
      const { transactionID } = await present(presentationVCIDs, signer, vcRequest);
      setIsLoading(false);
      setIssueResult("success");
      onOpen();
      setTimeout(async () => {
        await router.push({
          pathname: "/result",
          query: {
            type: "present",
            result: "true",
            presentedCredentialIDs: presentationVCIDs,
            nextPath: `/transaction/${transactionID}`,
          },
        });
      }, 3000);
    } catch (e) {
      setIsLoading(false);
      setIssueResult("faild");
      onOpen();
      setTimeout(async () => {
        await router.push({
          pathname: "/result",
          query: { type: "present", result: "false", errorMessage: "Present Faild" },
        });
      }, 3000);
      console.error("ERROR: " + e.message);
    }
  };

  return (
    <Box>
      {isLoading ? <Progress size="xs" isIndeterminate /> : <Box paddingTop="4px"></Box>}
      <Box marginY={5}>
        <Heading size={"xs"}>証明書を提示する</Heading>
        <Box>
          <Text display="inline-block" color="muted" fontSize={12}>
            証明書の提示先を確認してください。証明書は
          </Text>
          <Link href="/credentials">
            <Text display="inline-block" textDecoration={"underline"} color={"blue.500"} fontSize={12}>
              証明書一覧
            </Text>
          </Link>
          <Text display="inline-block" color="muted" fontSize={12}>
            から確認することができます
          </Text>
        </Box>
      </Box>

      <Box marginTop={0}>
        {vcRequest ? (
          <>
            <Box>
              あなたは
              {vcRequest.claims.vp_token.presentation_definition.input_descriptors.map((requiredVC, i) => {
                if (i === 0) {
                  return (
                    <Text key={requiredVC.id} fontWeight={"bold"} display="inline-block">
                      {translateText(requiredVC.id)}
                    </Text>
                  );
                } else {
                  return (
                    <Box display={"inline"} key={requiredVC.id}>
                      と
                      <Text key={requiredVC.id} fontWeight={"bold"} display="inline-block">
                        {translateText(requiredVC.id)}
                      </Text>
                    </Box>
                  );
                }
              })}
              を提示する必要があり、この証明書の情報は
              <Text fontWeight={"bold"} display="inline-block">
                {translateText(vcRequest.client_id)}
              </Text>
              に対して共有されます
            </Box>

            <Box marginY={5}>
              <Divider />
            </Box>
            <Box marginBottom={3}>
              <Text>あなたが提示する証明書</Text>
            </Box>
            {vcRequest && (
              <>
                <Box paddingBottom={5}>
                  <SelectVC
                    vcRequest={vcRequest}
                    presentationVCIDs={presentationVCIDs}
                    setPresentationVCIDs={setPresentationVCIDs}
                  />
                </Box>
              </>
            )}
            <Stack spacing="6">
              <Stack spacing="4">
                <Button
                  onClick={async () => await presentVC()}
                  colorScheme="teal"
                  disabled={
                    (vcRequest &&
                      presentationVCIDs.length <
                        vcRequest.claims.vp_token.presentation_definition.input_descriptors.length) ||
                    isLoading
                  }
                  isLoading={isLoading}
                  loadingText="取得中"
                  spinnerPlacement="start"
                >
                  提出する
                </Button>
                <Link href="/">
                  <Button w="100%">キャンセル</Button>
                </Link>
                <ResultPopup result={issueResult} isOpen={isOpen} onClose={onClose} />
              </Stack>
            </Stack>
          </>
        ) : (
          <>
            <Center>
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"></Spinner>
            </Center>
          </>
        )}
      </Box>
    </Box>
  );
};
