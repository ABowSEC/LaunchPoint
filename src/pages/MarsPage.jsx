import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Divider,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import MarsFeed from "../components/MarsFeed";

const ROVERS = ["Curiosity", "Perseverance", "Opportunity", "Spirit"];

export default function MarsPage() {
  const [rover, setRover] = useState("Curiosity");
  const [page, setPage] = useState(1);

  const handleRoverChange = (selected) => {
    setRover(selected);
    setPage(1);
  };

  return (
    <Container maxW="8xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" bgGradient="linear(to-r, red.400, orange.500)" bgClip="text">
            Mars Rover Photos
          </Heading>
          <Text fontSize="lg" color="text.secondary" maxW="600px" mx="auto" mt={4}>
            Browse NASA's Mars rover photo archive powered by the NASA Image & Video Library.
          </Text>
          <Divider mt={6} borderColor="border.default" />
        </Box>

        <Box textAlign="center">
          <Text mb={3} fontWeight="semibold" color="text.primary">Select Rover</Text>
          <ButtonGroup spacing={3} flexWrap="wrap" justifyContent="center">
            {ROVERS.map((r) => (
              <Button
                key={r}
                onClick={() => handleRoverChange(r)}
                colorScheme={rover === r ? "orange" : "gray"}
                variant={rover === r ? "solid" : "outline"}
                size="sm"
              >
                {r}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <MarsFeed rover={rover} page={page} onPageChange={setPage} />
      </VStack>
    </Container>
  );
}
