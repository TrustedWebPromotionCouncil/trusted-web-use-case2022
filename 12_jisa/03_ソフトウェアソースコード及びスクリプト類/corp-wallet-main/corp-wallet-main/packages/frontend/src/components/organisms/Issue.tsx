import { Box, Button, Center, Heading, Link, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

import { issue } from "../../lib/issue";
import { Signer } from "../../lib/signer";
import { translateText } from "../../lib/translate/translateText";
import { AcquiredIdToken, Manifest, VCRequest } from "../../types";
import { SelectVC } from "../molecules/IssueanceSelectVC";
import { PreviewCredentialCard } from "../molecules/PreviewCredentialCard";
import { ResultPopup } from "../molecules/ResultPopup";
const PinInput = dynamic(() => import("react-pin-input"), { ssr: false });

export interface IssueProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredIdToken;
}

// TODO: redirectUriを動的に設定する
// TODO: https://wallet-selmid.vercel.app/issueに変更
export const Issue: React.FC<IssueProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [issueResult, setIssueResult] = React.useState<undefined | "success" | "faild">(undefined);
  const [presentationVCIDs, setPresentationVCIDs] = React.useState<string[]>([]);
  const [pinStatus, setPinStatus] = React.useState<undefined | "success" | "no entered">(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    if (vcRequest?.pin !== undefined) {
      setPinStatus("no entered");
    }
  }, [vcRequest?.pin]);

  const issueVC = async () => {
    setIsLoading(true);
    const signer = new Signer();
    try {
      const { credentialID, transactionID } = await issue(
        signer,
        vcRequest,
        manifest,
        acquiredAttestation,
        presentationVCIDs
      );
      setIsLoading(false);
      setIssueResult("success");
      onOpen();
      setTimeout(async () => {
        await router.push({
          pathname: "/result",
          query: {
            type: "issue",
            result: "true",
            issuedCredentialID: credentialID,
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
          query: { type: "issue", result: "false", errorMessage: "Issue Faild" },
        });
      }, 3000);
      console.error(e.message);
    }
  };

  return (
    <>
      <Box marginY={5}>
        <Heading size={"xs"}>証明書を発行する</Heading>
        <Box>
          <Text display="inline-block" color="muted" fontSize={12}>
            証明書の発行先を確認してください。発行された証明書は
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
        {manifest && acquiredAttestation ? (
          manifest &&
          acquiredAttestation && (
            <>
              <Box>
                <Text fontWeight={"bold"} display="inline-block">
                  {translateText(manifest.display.card.issuedBy)}
                </Text>
                から
                <Text fontWeight={"bold"} display="inline-block">
                  {translateText(manifest.display.card.title)}
                </Text>
                が発行されます。
                {manifest.input.attestations.presentations ? "発行のためにあなたは" : ""}
                {manifest.input.attestations.presentations?.map((requiredVC, i) => {
                  if (i === 0) {
                    return (
                      <Text key={requiredVC.id} fontWeight={"bold"} display="inline-block">
                        {translateText(requiredVC.credentialType)}
                      </Text>
                    );
                  } else {
                    return (
                      <Box display={"inline"} key={requiredVC.id}>
                        と
                        <Text key={requiredVC.id} fontWeight={"bold"} display="inline-block">
                          {translateText(requiredVC.credentialType)}
                        </Text>
                      </Box>
                    );
                  }
                })}
                {manifest.input.attestations.presentations ? (
                  <>
                    を提示する必要があり、この証明書の情報は
                    <Text fontWeight={"bold"} display="inline-block">
                      {translateText(manifest.display.card.issuedBy)}
                    </Text>
                    に対して共有されます
                  </>
                ) : (
                  <></>
                )}
              </Box>
              <Box marginTop={8} marginBottom={3}>
                <Text>あなたが受け取る証明書</Text>
              </Box>
              <Box mb="8">
                <PreviewCredentialCard manifest={manifest} />
              </Box>
              {vcRequest && (
                <>
                  <SelectVC
                    manifest={manifest}
                    presentationVCIDs={presentationVCIDs}
                    setPresentationVCIDs={setPresentationVCIDs}
                  />
                </>
              )}
              {pinStatus && (
                <Box>
                  <Text textAlign="center" fontSize="lg" fontWeight="bold">
                    Input Pin Code
                  </Text>
                  <Box p={3}>
                    <Center>
                      <PinInput
                        length={4}
                        initialValue=""
                        type="numeric"
                        inputMode="number"
                        onChange={(value, index) => {
                          // TODO: 動的にpin valueを設定する
                          if (value === "1234") {
                            setPinStatus("success");
                          } else {
                            setPinStatus("no entered");
                          }
                        }}
                      />
                    </Center>
                  </Box>
                </Box>
              )}
              <Stack spacing="4">
                <Button
                  disabled={(() => {
                    if (
                      (manifest.input.attestations.idTokens &&
                        Object.keys(acquiredAttestation).length < manifest.input.attestations.idTokens.length) ||
                      pinStatus === "no entered" ||
                      isLoading
                    ) {
                      return true;
                    } else if (
                      manifest.input.attestations.presentations &&
                      presentationVCIDs.length < manifest.input.attestations.presentations.length
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  })()}
                  onClick={async () => await issueVC()}
                  colorScheme="teal"
                  isLoading={isLoading}
                  loadingText="取得中"
                  spinnerPlacement="start"
                >
                  取得する
                </Button>
                <Link href="/">
                  <Button w="100%">キャンセル</Button>
                </Link>
                <ResultPopup result={issueResult} isOpen={isOpen} onClose={onClose} />
              </Stack>
            </>
          )
        ) : (
          <>
            <Box h={"100%"}>
              <Center h={"100%"}>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"></Spinner>
              </Center>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
