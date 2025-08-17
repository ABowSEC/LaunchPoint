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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorMode
} from "@chakra-ui/react";
import { StarIcon, TimeIcon } from "@chakra-ui/icons";
import { FaRocket } from "react-icons/fa";
import LaunchFeed from "../components/LaunchFeed";

export default function LaunchPage() {
  const { colorMode } = useColorMode();
  
  return (
    <Container maxW="8xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box textAlign="center">
          <VStack spacing={4}>
            <HStack justify="center" spacing={3}>
              {/*<Icon as={StarIcon} w={8} h={8} color="blue.400" />*/}
              <Heading 
                as="h1" 
                size="2xl" 
                bgGradient="linear(to-r, blue.400, purple.500)" 
                bgClip="text"
              >
                Launch Tracker
              </Heading>
            </HStack>
            
            <Text 
              fontSize="lg" 
              color="text.secondary" 
              maxW="700px" 
              textAlign="center"
              lineHeight="1.6"
            >
              Stay up-to-date with upcoming NASA launches, missions, and space exploration events. 
              Track launch schedules, mission details, and launch windows in real-time.
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

        {/* Launch Statistics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box 
            bg="bg.card" 
            p={6} 
            rounded="xl" 
            shadow="md" 
            textAlign="center"
            border="1px solid"
            borderColor="border.default"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
              borderColor: "blue.300"
            }}
            transition="all 0.3s"
          >
            <Icon as={FaRocket} w={8} h={8} color="blue.400" mb={3} />
            <Stat>
              <StatNumber fontSize="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">{/*I Really Love Gradient desings TBH could add more pertaining to icons or graphics of rocket launching in card */}
                Live
              </StatNumber>
              <StatLabel>Launch Tracking</StatLabel>
              <StatHelpText>Real-time updates</StatHelpText>
            </Stat>
          </Box>
          
          <Box 
            bg="bg.card" 
            p={6} 
            rounded="xl" 
            shadow="md" 
            textAlign="center"
            border="1px solid"
            borderColor="border.default"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
              borderColor: "green.300"
            }}
            transition="all 0.3s"
          >
            <Icon as={TimeIcon} w={8} h={8} color="green.400" mb={3} />
            <Stat>
              <StatNumber fontSize="2xl" bgGradient="linear(to-r, green.400, teal.500)" bgClip="text">
                Countdown
              </StatNumber>
              <StatLabel>Live Timers</StatLabel>
              <StatHelpText>Precision timing</StatHelpText>
            </Stat>
          </Box>
          
          <Box 
            bg="bg.card" 
            p={6} 
            rounded="xl" 
            shadow="md" 
            textAlign="center"
            border="1px solid"
            borderColor="border.default"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
              borderColor: "purple.300"
            }}
            transition="all 0.3s"
          >
            <Icon as={StarIcon} w={8} h={8} color="purple.400" mb={3} />
            <Stat>
              <StatNumber fontSize="2xl" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">
                Global
              </StatNumber>
              <StatLabel>Space Agencies</StatLabel>
              <StatHelpText>Worldwide coverage</StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Launch Feed Section */}
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

        {/* Info Section */}
        <Box 
          bg="bg.card" 
          p={6} 
          borderRadius="lg" 
          border="1px solid"
          borderColor="border.default"
          mt={8}
        >
          <VStack spacing={4}>
            <Heading as="h3" size="md" color="brand.primary" textAlign="center">
              About Launch Tracking
            </Heading>
            <VStack spacing={3} textAlign="center">
              <Text fontSize="sm" color="text.primary" maxW="600px">
                Launch times are subject to change due to weather conditions, technical issues, 
                or range conflicts. We provide the most up-to-date information available from NASA's 
                official sources.
              </Text>
              <Text fontSize="xs" color="text.secondary" fontStyle="italic">
                All times displayed in your local timezone
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Quick Stats or Status  */}
        <Box 
          bg="bg.card" 
          p={4} 
          borderRadius="md" 
          textAlign="center"
        >
          <Text fontSize="sm" color="text.secondary">
            Data refreshed automatically • Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}