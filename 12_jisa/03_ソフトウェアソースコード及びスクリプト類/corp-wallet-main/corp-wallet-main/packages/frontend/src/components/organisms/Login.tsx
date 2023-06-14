import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Button, Container, Heading, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useEffect } from "react";

import { loginRequest } from "../../lib/auth/config";

export const Login = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  return (
    <>
      <Container maxW="md" py={{ base: "12", md: "24" }}>
        <Stack spacing="8">
          <Stack spacing="6" align="center">
            <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>ログイン</Heading>
            <Text color="muted">ログインにはモバイルウォレットが必要です</Text>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="4">
              <Button variant="primary" onClick={() => instance.loginRedirect(loginRequest)}>
                ログイン
              </Button>
            </Stack>
          </Stack>
          <Button variant="link" colorScheme="blue" size="sm">
            ログインでお困りのかたはこちら
          </Button>
        </Stack>
      </Container>
    </>
  );
};
