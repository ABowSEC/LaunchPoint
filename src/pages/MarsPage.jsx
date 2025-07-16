import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Divider,
  Badge,
  Select,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import MarsFeed from "../components/MarsFeed";

export default function MarsPage() {
  const [availableSols, setAvailableSols] = useState([]);
  const [sol, setSol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        const solsWithPhotos = data.photo_manifest.photos.map((entry) => entry.sol);
        setAvailableSols(solsWithPhotos);
        setSol(solsWithPhotos[0]); // default to first valid sol
      } catch (err) {
        console.error("Error fetching manifest:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManifest();
  }, []);

  const handleSelect = (e) => {
    const selected = e.target.value;
    setSol(selected);
    // Don't navigate, just update the sol state to show photos on this page
  };

  return (
    <Container maxW="8xl" py={8}>
      <Breadcrumb mb={6} fontSize="sm" color="text.secondary">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/mars">Mars</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" bgGradient="linear(to-r, red.400, orange.500)" bgClip="text">
            Mars Rover Photos
          </Heading>

          <Text fontSize="lg" color="text.secondary" maxW="600px" mx="auto" mt={4}>
            Select a Martian day where NASA’s Curiosity rover captured photos.
          </Text>
          <Divider mt={6} borderColor="border.default" />
        </Box>

        <Box w="100%" maxW="400px" mx="auto">
          <Heading size="md" textAlign="center" mb={2} color="text.primary">
            Available Sols
          </Heading>

          {loading ? (
            <Spinner size="lg" />
          ) : (
            <Select value={sol} onChange={handleSelect}>
              {availableSols.map((val) => (
                <option key={val} value={val}>
                  Sol {val}
                </option>
              ))}
            </Select>
          )}
        </Box>

        {/* Mars Photos Feed */}
        {sol && (
          <Box w="100%">
            <MarsFeed sol={sol} />
          </Box>
        )}
      </VStack>
    </Container>
  );
}
