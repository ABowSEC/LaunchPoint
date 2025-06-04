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
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MarsPage() {
  const [availableSols, setAvailableSols] = useState([]);
  const [sol, setSol] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const textColor = useColorModeValue("gray.700", "gray.300");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("red.200", "red.500");

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
    navigate(`/mars/sol/${selected}`);
  };

  return (
    <Container maxW="8xl" py={8}>
      <Breadcrumb mb={6} fontSize="sm" color={subTextColor}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/mars">Mars</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" color="red.600">
            Mars Rover Photos
          </Heading>
          <Badge colorScheme="red" variant="outline" fontSize="md" px={3} py={1}>
            Choose a Sol with Photos
          </Badge>
          <Text fontSize="lg" color={subTextColor} maxW="600px" mx="auto" mt={4}>
            Select a Martian day where NASA’s Curiosity rover captured photos.
          </Text>
          <Divider mt={6} borderColor={dividerColor} />
        </Box>

        <Box w="100%" maxW="400px" mx="auto">
          <Heading size="md" textAlign="center" mb={2} color={textColor}>
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
      </VStack>
    </Container>
  );
}
