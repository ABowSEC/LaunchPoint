import {
  Box,
  VStack,
  Text,
  Heading,
  Badge,
  Link,
  HStack,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CalendarIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { timelineData, TYPE_CONFIG } from "../data/timelineData";

const MotionBox = motion(Box);

export default function Timeline() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? timelineData
      : timelineData.filter((item) => item.type === activeFilter);

  return (
    <VStack spacing={6} align="stretch">
      {/* Filter buttons */}
      <Wrap spacing={2}>
        <WrapItem>
          <Button
            size="sm"
            variant={activeFilter === "all" ? "solid" : "outline"}
            colorScheme="gray"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
        </WrapItem>
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <WrapItem key={type}>
            <Button
              size="sm"
              variant={activeFilter === type ? "solid" : "outline"}
              colorScheme={cfg.color}
              onClick={() => setActiveFilter(type)}
            >
              {cfg.label}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      <Text fontSize="sm" color="text.secondary">
        {filtered.length} mission{filtered.length !== 1 ? "s" : ""}
      </Text>

      <VStack spacing={4} align="stretch">
        {filtered.map((item, index) => {
          const cfg = TYPE_CONFIG[item.type] ?? { color: "gray", label: item.type };
          return (
            <MotionBox
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ translateY: -2 }}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              bg="bg.card"
              borderColor="border.default"
              shadow="md"
              _hover={{ borderColor: `${cfg.color}.400`, shadow: "lg" }}
            >
              <HStack justify="space-between" mb={3} wrap="wrap" gap={2}>
                <HStack spacing={2}>
                  <Badge colorScheme={cfg.color} variant="subtle">
                    {cfg.label}
                  </Badge>
                  <Badge
                    colorScheme={item.status === "success" ? "green" : "blue"}
                    variant="outline"
                  >
                    {item.status}
                  </Badge>
                </HStack>
                <HStack spacing={1} color="text.secondary">
                  <CalendarIcon boxSize={3} />
                  <Text fontSize="sm" fontWeight="semibold">
                    {item.year}
                  </Text>
                </HStack>
              </HStack>

              <Heading size="sm" mb={2} color="text.primary">
                {item.title}
              </Heading>

              <Text fontSize="sm" color="text.secondary" lineHeight="1.7" mb={3}>
                {item.description}
              </Text>

              <Link href={item.link} isExternal color="teal.400" fontSize="sm" fontWeight="medium">
                Learn More <ExternalLinkIcon mx="2px" />
              </Link>
            </MotionBox>
          );
        })}
      </VStack>
    </VStack>
  );
}
