import { Box, Container, Flex, Image, Link } from "@chakra-ui/react";
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
          {/* Full brand lockup; screen blend melts its dark field into the footer */}
          <Image
            src="/icons/launchpointFULLIMG.png"
            alt="LaunchPoint - explore, build, launch"
            h={{ base: "72px", md: "88px" }}
            w="auto"
            mixBlendMode="screen"
            draggable={false}
            flexShrink={0}
          />

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
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
