import { Box, Heading, Text, Input, VStack, Container } from "@chakra-ui/react";
import { useState } from "react";
import Timeline from "../components/Timeline";

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  return (
    <Container maxW="7xl" py={10} bg="bg.body">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" color="brand.primary">Explore the Cosmos</Heading>
          <Text fontSize="lg" color="text.secondary">
            Search NASA data, explore missions, and discover celestial events.
          </Text>
        </Box>

        <Box>
          <Input
            placeholder="Search NASA content (e.g., Mars, Apollo, ISS)"
            size="lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="bg.card"
            borderRadius="md"
            boxShadow="md"
          />
        </Box>

        {/*  search results and filterable categories */}
        <Box mt={6}>
          <Text color="text.secondary" fontStyle="italic">
            Feature under construction. Soon you'll be able to search for images, missions, and events.
          </Text>
        </Box>

        <Container maxW="6xl" py={12}>
            <Heading size="xl" mb={6} color="brand.primary">Explore Missions & Discoveries</Heading>
  
            <Text fontSize="lg" mb={8} color="text.primary">
                Dive into NASA's legacy. From early Apollo missions to modern Mars exploration. Click any mission for reports or media.
            </Text>

            <Timeline />  {/* Embedded timeline component here */}

            {/* need filters or search */}
        </Container>
      </VStack>
    </Container>
  );
}
