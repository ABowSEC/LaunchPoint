import { 
  Box, 
  Heading, 
  VStack, 
  Text, 
  Container,
  HStack,
  Icon,
  Divider,
  Badge,
  useColorModeValue
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import LaunchFeed from "../components/LaunchFeed";


//rotating ICON wanting to be implemnted 
export const IconWithReactIcon = () => (
  <Icon size="lg" color="tomato">
    <Md3dRotation />
  </Icon>
)


// Main page to display upcoming NASA and space agency launches
export default function LaunchPage() {
  return (
    <Container maxW="8xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* ================= Header Section ================= */}
        <Box textAlign="center">
          <VStack spacing={4}>
            {/* Title with icon */}
            <HStack justify="center" spacing={3}>
              <Icon as={StarIcon} w={8} h={8} color="blue.500" />
              <Heading as="h1" size="2xl" color="blue.600">
                Launch Tracker
              </Heading>
              <Icon as={StarIcon} w={8} h={8} color="blue.500" />
            </HStack>

            {/* Subtitle description */}
            <Text 
              fontSize="lg" 
              color="gray.600" 
              maxW="700px" 
              textAlign="center"
              lineHeight="1.6"
            >
              Stay up-to-date with upcoming NASA launches, missions, and space exploration events. 
              Track launch schedules, mission details, and launch windows in real-time.
            </Text>

            {/* Badges for key features */}
            <HStack spacing={4} mt={4}>
              <Badge colorScheme="blue" variant="outline" fontSize="sm" px={3} py={1}>
                Live Updates
              </Badge>
              <Badge colorScheme="green" variant="outline" fontSize="sm" px={3} py={1}>
                Mission Details
              </Badge>
              <Badge colorScheme="purple" variant="outline" fontSize="sm" px={3} py={1}>
                Launch Windows
              </Badge>
            </HStack>
          </VStack>

          <Divider mt={8} borderColor="blue.200" />
        </Box>

        {/* ================= Launch Feed Section ================= */}
        <Box>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading 
                as="h2" 
                size="lg" 
                color = {useColorModeValue("gray.700","gray.200")}
                mb={2}
                textAlign={{ base: "center", md: "left" }}
              >
                Upcoming Launches
              </Heading>
              <Text 
                color="gray.600" 
                fontSize="md"
                textAlign={{ base: "center", md: "left" }}
              >
                Latest information from NASA's launch schedule
              </Text>
            </Box>

            {/* LaunchFeed dynamically renders next 5 upcoming launches */}
            <LaunchFeed />
          </VStack>
        </Box>

        {/* ================= Informational Section ================= */}
        <Box 
          bg="blue.50" 
          p={6} 
          borderRadius="lg" 
          border="1px solid"
          borderColor="blue.100"
          mt={8}
        >
          <VStack spacing={4}>
            <Heading as="h3" size="md" color="blue.700" textAlign="center">
              About Launch Tracking
            </Heading>
            <VStack spacing={3} textAlign="center">
              <Text fontSize="sm" color="gray.700" maxW="600px">
                Launch times are subject to change due to weather conditions, technical issues, 
                or range conflicts. We provide the most up-to-date information available from NASA's 
                official sources.
              </Text>
              <Text fontSize="xs" color="gray.500" fontStyle="italic">
                All times displayed in your local timezone
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* ================= Footer / Status Note ================= */}
        <Box 
          bg="gray.300" 
          p={4} 
          borderRadius="sm" 
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.600">
             Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
