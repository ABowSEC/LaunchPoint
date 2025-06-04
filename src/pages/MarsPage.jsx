import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Container,
  Divider,
  Badge
} from "@chakra-ui/react";
import MarsFeed from "../components/MarsFeed";

export default function MarsPage() {
  return (
    <Container maxW="8xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box textAlign="center">
          <VStack spacing={4}>
            <Heading 
              as="h1" 
              size="2xl" 
              color="red.600"
              textAlign="center"
            >
              Mars Rover Photos
            </Heading>
            
            <Box>
              <Badge 
                colorScheme="red" 
                variant="outline" 
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                Sol 1000
              </Badge>
            </Box>
            
            <Text 
              fontSize="lg" 
              color="gray.600" 
              maxW="600px" 
              textAlign="center"
              lineHeight="1.6"
            >
              Explore stunning images captured by NASA's Mars rovers on their 1000th Martian day. 
              Each photo offers a unique glimpse into the Red Planet's mysterious landscape.
            </Text>
          </VStack>
          
          <Divider mt={8} borderColor="red.200" />
        </Box>

        {/* Mars Feed Section */}
        <Box>
          <MarsFeed />
        </Box>

        {/* Info Section */}
        <Box 
          bg="red.50" 
          p={6} 
          borderRadius="lg" 
          border="1px solid"
          borderColor="red.100"
          mt={8}
        >
          <VStack spacing={3} textAlign="center">
            <Heading as="h3" size="md" color="red.700">
              About Sol Days
            </Heading>
            <Text fontSize="sm" color="gray.700" maxW="500px">
              A "Sol" is a Martian day, approximately 24 hours and 37 minutes long. 
              Sol 1000 represents significant milestones in each rover's mission timeline.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}