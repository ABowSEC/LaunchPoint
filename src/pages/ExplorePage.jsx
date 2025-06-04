import { Box, Heading, Text, Input, VStack, Container } from "@chakra-ui/react";
import { useState } from "react";

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  return (
    <Container maxW="7xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" color="teal.500">Explore the Cosmos</Heading>
          <Text fontSize="lg" color="gray.600">
            Search NASA data, explore missions, and discover celestial events.
          </Text>
        </Box>

        <Box>
          <Input
            placeholder="Search NASA content (e.g., Mars, Apollo, ISS)"
            size="lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="white"
            borderRadius="md"
            boxShadow="md"
          />
        </Box>

        {/*  search results and filterable categories */}
        <Box mt={6}>
          <Text color="gray.500" fontStyle="italic">
            Feature under construction — soon you'll be able to search for images, missions, and events.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
