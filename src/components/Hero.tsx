import { Flex, Heading, Box, Icon } from "@chakra-ui/react";
import { FaPlane } from "react-icons/fa";

export const Hero = ({ title }: { title: string }) => (
  <Flex
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    mt="4rem"
  >
    <Icon as={FaPlane} boxSize={12} color="#FF0080" />

    <Flex
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      bgClip="text"
    >
      <Heading fontSize="6vw">{title}</Heading>
    </Flex>
  </Flex>
);

Hero.defaultProps = {
  title: "<Quotify>",
};
