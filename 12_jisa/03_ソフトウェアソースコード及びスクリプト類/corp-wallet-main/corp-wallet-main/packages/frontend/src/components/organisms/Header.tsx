import { useMsal } from "@azure/msal-react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FiSettings } from "react-icons/fi";

import { resetDatabase } from "../../lib/repository/demo";

interface HeaderProps {
  showHomeIcon?: boolean;
  showQrcodeIcon?: boolean;
  showBackIcon?: boolean;
  showDeleteIcon?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const { instance } = useMsal();
  const router = useRouter();
  // TODO: 一旦、アバターを押すとログアウトするようにしている
  // TODO: ロゴの変更

  const hundleClickDemoButton = async () => {
    await resetDatabase();
    router.push("/");
  };

  return (
    <Box as="section" bg="white">
      <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} p={4}>
        <Flex justify="space-between">
          <HStack spacing="4">
            <Box>
              <Link href="/">
                <Heading fontSize={"md"} lineHeight={1}>
                  UI Demo
                </Heading>
              </Link>
            </Box>
            <Box>
              <Button
                onClick={async () => {
                  await hundleClickDemoButton();
                }}
                colorScheme="orange"
              >
                Demo Reset DataBase
              </Button>
            </Box>
          </HStack>
          <HStack spacing="4">
            <ButtonGroup variant="ghost" spacing="1">
              <IconButton icon={<FiSettings fontSize="1.25rem" />} aria-label="Settings" />
            </ButtonGroup>
            <Avatar
              onClick={() => instance.logout()}
              boxSize="10"
              name="Christoph Winston"
              src="https://tinyurl.com/yhkm2ek8"
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};
