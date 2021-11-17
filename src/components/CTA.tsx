import { Link as ChakraLink, Button } from '@chakra-ui/react'

import { Container } from './Container'

export const CTA = () => (
  <Container
    flexDirection="row"
    position="fixed"
    bottom="0"
    width="100%"
    maxWidth="48rem"
    py={3}
  >
    <ChakraLink isExternal href="https://github.com/devdumpling" flexGrow={1} mx={2}>
      <Button width="100%" variant="outline" colorScheme="teal">
        Devon's Github
      </Button>
    </ChakraLink>

    <ChakraLink
      isExternal
      href="https://github.com/devdumpling/battleface-next"
      flexGrow={3}
      mx={2}
    >
      <Button width="100%" variant="solid" colorScheme="teal">
        Source
      </Button>
    </ChakraLink>
  </Container>
)
