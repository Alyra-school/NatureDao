"use client";

import { Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      p="1rem"
      justifyContent="center"
      alignItems="center"
      width="100%"
      pos="fixed"
      bottom="0"
      zIndex={2}
    >
      <Text fontSize={14}>© NatureDAO by Cécile Hirschauer</Text>
    </Flex>
  );
};

export default Footer;
