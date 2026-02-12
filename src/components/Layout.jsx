import { Box, Container } from "@chakra-ui/react";

function Layout({ children }) {
  return (
    <Box minH="100vh" bgGradient="linear(to-b, gray.900, black)" color="white" py={10} px={4}>
      <Container maxW="6xl">
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
