// Chakra UI components for layout and styling
import {
  Box,
  VStack,
  Text,
  Heading,
  Badge,
  Link,
  Divider,
  HStack,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";

// Chakra UI icons
import { ExternalLinkIcon, CalendarIcon } from "@chakra-ui/icons";

// Framer Motion for animation effects
import { motion } from "framer-motion";

// Wrap Chakra's Box with motion capabilities
const MotionBox = motion(Box);

// Timeline data — each object represents a space mission milestone
const timelineData = [
  {
    year: "1969",
    title: "Apollo 11 Moon Landing",
    description: "First humans on the Moon.",
    link: "https://www.nasa.gov/mission_pages/apollo/apollo11.html",
    type: "moon",
    status: "success"
  },
  {
    year: "1990",
    title: "Hubble Space Telescope Launch",
    description: "Revolutionized space observation.",
    link: "https://www.nasa.gov/mission_pages/hubble/story/index.html",
    type: "satellite",
    status: "success"
  },
  {
    year: "2012",
    title: "Mars Curiosity Rover Lands",
    description: "Exploring Mars since 2012.",
    link: "https://mars.nasa.gov/msl/mission/overview/",
    type: "rover",
    status: "success"
  },
  {
    year: "2022",
    title: "Artemis I Launch",
    description: "First Artemis test flight around the Moon.",
    link: "https://www.nasa.gov/artemis-1",
    type: "moon",
    status: "success"
  },
  {
    year: "2025",
    title: "Artemis II (Planned)",
    description: "First crewed Artemis mission.",
    link: "https://www.nasa.gov/specials/artemis/",
    type: "moon",
    status: "planned"
  }
];

// Main component to render animated timeline of missions
export default function Timeline() {
  // Adjust background and text colors based on light/dark mode
  const bg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <VStack spacing={8} align="stretch" p={4} bg={bg} borderRadius="lg">
      <Heading textAlign="center" color="teal.500">
        Mission Timeline
      </Heading>

      {/* Loop through each timeline item and display it with animation */}
      {timelineData.map((item, index) => (
        <MotionBox
          key={index}
          whileHover={{ scale: 1.02 }} // Slight grow on hover
          initial={{ opacity: 0, y: 20 }} // Start slightly faded and lowered
          animate={{ opacity: 1, y: 0 }}  // Animate into view
          transition={{ duration: 0.5, delay: index * 0.2 }} // Stagger entries
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue("white", "gray.700")}
          shadow="md"
        >
          {/* Top row: status badge and year */}
          <HStack justify="space-between" mb={2}>
            <Badge colorScheme={item.status === "success" ? "green" : "blue"}>
              {item.status}
            </Badge>
            <HStack>
              <CalendarIcon />
              <Text fontSize="sm">{item.year}</Text>
            </HStack>
          </HStack>

          {/* Mission title and description */}
          <Heading size="md" mb={2}>{item.title}</Heading>
          <Text mb={3} color={textColor}>{item.description}</Text>

          {/* External link to learn more */}
          <Link href={item.link} isExternal color="teal.500">
            Learn More <ExternalLinkIcon mx="2px" />
          </Link>
        </MotionBox>
      ))}

      {/* Divider at bottom of timeline */}
      <Divider borderColor="teal.300" mt={6} />
    </VStack>
  );
}
