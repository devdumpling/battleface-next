import { Flex, FlexProps } from '@chakra-ui/react'

export const Footer = (props: FlexProps) => (
  <Flex position="absolute" bottom="0" as="footer" py="8rem" {...props} />
)
