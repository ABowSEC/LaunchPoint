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
  SimpleGrid,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import { FaRocket, FaGlobeAmericas } from "react-icons/fa";
import LaunchFeed from "../components/LaunchFeed";

const FEATURE_CARDS = [
  {
    icon: FaRocket,
    color: "blue.400",
    hoverBorder: "blue.300",
    gradient: "linear(to-r, blue.400, purple.500)",
    title: "Live Tracking",
    subtitle: "Launch Monitoring",
    detail: "Real-time updates",
  },
  {
    icon: TimeIcon,
    color: "green.400",
    hoverBorder: "green.300",
    gradient: "linear(to-r, green.400, teal.500)",
    title: "Countdown Timers",
    subtitle: "Precision Timing",
    detail: "Down to the second",
  },
  {
    icon: FaGlobeAmericas,
    color: "purple.400",
    hoverBorder: "purple.300",
    gradient: "linear(to-r, purple.400, pink.500)",
    title: "Global Coverage",
    subtitle: "All Space Agencies",
    detail: "NASA, SpaceX, ESA & more",
  },
];

export default function LaunchPage() {
  return (
    <Container maxW="8xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <VStack spacing={4}>
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Launch Tracker
            </Heading>

            <Text
              fontSize="lg"
              color="text.secondary"
              maxW="700px"
              textAlign="center"
              lineHeight="1.6"
            >
              Stay up-to-date with upcoming launches, missions, and space exploration events.
              Track schedules, mission details, and launch windows in real-time.
            </Text>

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

          <Divider mt={8} borderColor="border.default" />
        </Box>

        {/* Feature cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {FEATURE_CARDS.map(({ icon, color, hoverBorder, gradient, title, subtitle, detail }) => (
            <Box
              key={title}
              bg="bg.card"
              p={6}
              rounded="xl"
              shadow="md"
              textAlign="center"
              border="1px solid"
              borderColor="border.default"
              _hover={{ transform: "translateY(-2px)", shadow: "lg", borderColor: hoverBorder }}
              transition="all 0.3s"
            >
              <Icon as={icon} w={8} h={8} color={color} mb={3} />
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient={gradient}
                bgClip="text"
                mb={1}
              >
                {title}
              </Text>
              <Text fontSize="sm" color="text.primary" fontWeight="medium">
                {subtitle}
              </Text>
              <Text fontSize="xs" color="text.secondary" mt={1}>
                {detail}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Launch Feed */}
        <Box>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading
                as="h2"
                size="lg"
                color="text.primary"
                mb={2}
                textAlign={{ base: "center", md: "left" }}
              >
                Upcoming Launches
              </Heading>
              <Text
                color="text.secondary"
                fontSize="md"
                textAlign={{ base: "center", md: "left" }}
              >
                Latest information from global space agencies and launch providers
              </Text>
            </Box>

            <LaunchFeed />
          </VStack>
        </Box>

        {/* Footer note */}
        <Box
          bg="bg.card"
          p={4}
          borderRadius="md"
          border="1px solid"
          borderColor="border.default"
          textAlign="center"
        >
          <Text fontSize="sm" color="text.secondary">
            Launch times are subject to change due to weather, technical issues, or range conflicts ·
            All times in your local timezone · Updated automatically
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
