import { Box, Heading, VStack, Text } from "@chakra-ui/react";
import LaunchFeed from "../components/LaunchFeed";

export default function LaunchPage() {
  return (
    <Box p={8}>
      <Heading mb={6}>Upcoming NASA Launches</Heading>
      <VStack spacing={4} align="stretch">
        <LaunchFeed />
      </VStack>
    </Box>
  );
}
