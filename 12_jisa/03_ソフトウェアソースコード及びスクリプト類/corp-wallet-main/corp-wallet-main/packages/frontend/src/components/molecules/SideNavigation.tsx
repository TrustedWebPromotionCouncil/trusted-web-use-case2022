import { As, Button, ButtonProps, Flex, HStack, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { FiCreditCard, FiList, FiSettings } from "react-icons/fi";

export const SideNavigation = () => {
  return (
    <Flex as="section" bg={"transparent"}>
      <Flex flex="1" maxW={{ base: "full", sm: "xs" }} py={{ base: "6", sm: "8" }} px={{ base: "4", sm: "6" }}>
        <Stack justify="space-between" spacing="1" width="full">
          <Stack spacing="8" shouldWrapChildren>
            <Stack spacing="1">
              <Link href="/transaction">
                <NavButton label="税務申告一覧" icon={FiList} />
              </Link>
              <Link href="/credentials">
                <NavButton label="証明書一覧" icon={FiCreditCard} />
              </Link>
              <NavButton label="設定" icon={FiSettings} />
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};

interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
}

const NavButton = (props: NavButtonProps) => {
  const { icon, label, ...buttonProps } = props;
  return (
    <Button variant="ghost" justifyContent="start" {...buttonProps}>
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="subtle" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};
