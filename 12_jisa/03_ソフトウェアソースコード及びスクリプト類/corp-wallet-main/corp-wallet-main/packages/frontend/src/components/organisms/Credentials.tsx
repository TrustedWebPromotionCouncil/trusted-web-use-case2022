import { Box, Container, Stack, Text } from "@chakra-ui/react";
import React from "react";

import { useStoredVCs } from "../../hooks/useStoredVCs";
import { CredentialCard } from "../molecules/CredentialCard";

export const Credentials: React.FC = () => {
  const { storedVCs } = useStoredVCs();
  return (
    <>
      <Box as="section" py={{ base: "4", md: "8" }}>
        <Container maxW="3xl">
          <Stack spacing="5">
            <Stack spacing="1">
              <Text fontSize="lg" fontWeight="bold">
                証明書一覧
              </Text>
            </Stack>
            {storedVCs.map((storedVC) => {
              return <CredentialCard key={storedVC.credentialID} storedVC={storedVC} />;
            })}
          </Stack>
        </Container>
      </Box>
    </>
  );
};
