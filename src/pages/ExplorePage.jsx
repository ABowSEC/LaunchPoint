import { Box, Heading, Text, Input, VStack, Container, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import Timeline from "../components/Timeline";

// ExplorePage component allows users to explore space missions and (eventually) search NASA content
export default function ExplorePage() {
  const [query, setQuery] = useState(""); // Input state for future search functionality

  return (
    <Container maxW="7xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Page Heading */}
        <Box textAlign="center">
          <Heading size="2xl" color="teal.500">
            Explore the Cosmos
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Search NASA data, explore missions, and discover celestial events.
          </Text>
        </Box>

        {/* Search Input (planned feature) */}
        <Box>
          <Input
            placeholder="Search NASA content (e.g., Mars, Apollo, ISS)"
            size="lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg= {useColorModeValue("white","gray.700")}
            borderRadius="md"
            boxShadow="md"
          />
        </Box>

        {/* Placeholder for future search/filter results */}
        <Box mt={6}>
          <Text color="gray.500" fontStyle="italic">
            Feature under construction//soon you'll be able to search for images, missions, and events.
          </Text>
        </Box>

        {/* Timeline Section: Historical Missions & Discoveries */}
        <Container maxW="6xl" py={12}>
          <Heading size="xl" mb={6}>
            Explore Missions & Discoveries
          </Heading>

          <Text fontSize="lg" mb={8}>
            Dive into NASA's legacy! Early Apollo missions to modern Mars exploration.
            Click any mission for reports or media.
          </Text>

          <Timeline /> {/* Embedded animated mission timeline */}

          {/*  add category filters or search for timeline items */}
        </Container>
      </VStack>
    </Container>
  );
}
