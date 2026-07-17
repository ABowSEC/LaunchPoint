import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { SiKofi } from "react-icons/si";

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
        <Flex direction="column" align="center" textAlign="center" gap={6}>
          {/* Full brand lockup, centered. screen blend melts its near-black
              field into the footer, leaving the teal→purple mark glowing. */}
          <Image
            src="/icons/ephemeris-logo.png"
            alt="Project Ephemeris"
            w="auto"
            maxW={{ base: "260px", md: "360px" }}
            h="auto"
            mixBlendMode="screen"
            draggable={false}
          />

          <Flex direction="column" align="center" gap={1.5}>
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
              href="https://github.com/ABowSEC/Project-Ephemeris"
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
            <Link
              href="https://ko-fi.com/abowsec"
              isExternal
              fontSize="xs"
              color="text.secondary"
              _hover={{ color: "text.primary" }}
              display="inline-flex"
              alignItems="center"
              gap={1.5}
            >
              <SiKofi /> Support Ephemeris on Ko-fi
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
