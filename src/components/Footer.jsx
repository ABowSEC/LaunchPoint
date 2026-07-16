import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const CREDITS = [
  { label: "Launch data by The Space Devs", href: "https://thespacedevs.com" },
  { label: "Imagery courtesy of NASA", href: "https://apod.nasa.gov/apod/astropix.html" },
  {
    label: "Maps by OpenFreeMap © OpenMapTiles, data from OpenStreetMap contributors",
    href: "https://openfreemap.org",
  },
];

export default function Footer() {
  return (
    <Box
      as="footer"
      mt={16}
      borderTop="1px solid"
      borderColor="border.default"
      bg="rgba(6, 9, 26, 0.80)"
    >
      <Container maxW="7xl" py={8}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "flex-start" }}
          justify="space-between"
          gap={6}
        >
          {/* Emblem + wordmark until new brand art exists (the old full
              lockup image carries the previous name) */}
          <Flex align="center" gap={2.5} flexShrink={0}>
            <Image
              src="/icons/icon-192.png"
              alt=""
              boxSize="36px"
              borderRadius="full"
              draggable={false}
            />
            <Text
              fontWeight="700"
              fontSize="md"
              letterSpacing="widest"
              textTransform="uppercase"
              color="brand.400"
            >
              Ephemeris
            </Text>
          </Flex>

          <Flex
            direction="column"
            align={{ base: "center", md: "flex-end" }}
            textAlign={{ base: "center", md: "right" }}
            gap={1.5}
          >
            {CREDITS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                isExternal
                fontSize="xs"
                color="text.secondary"
                _hover={{ color: "text.primary" }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="https://github.com/ABowSEC/LaunchPoint"
              isExternal
              fontSize="xs"
              color="text.secondary"
              _hover={{ color: "text.primary" }}
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              mt={1}
            >
              <FaGithub /> Source on GitHub
            </Link>
            <Text fontSize="xs" color="text.secondary" opacity={0.7} mt={1}>
              An independent project, not affiliated with or endorsed by NASA.
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
