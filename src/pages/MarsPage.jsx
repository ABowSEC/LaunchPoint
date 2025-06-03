import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import MarsFeed from "../components/MarsFeed";

export default function MarsPage() {
  return (
    <Box p={17}>
      <Heading mb={4}>Mars Rover Photos (Sol 1000)</Heading>
      <MarsFeed />
    </Box>
  );
}
