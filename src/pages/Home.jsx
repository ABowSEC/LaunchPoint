import { useEffect, useState } from "react";
import { Box, Image, Text, Spinner, Heading } from "@chakra-ui/react";

export default function Home() {
  const [apod, setApod] = useState(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}`
      );
      const data = await res.json();
      setApod(data);
    };
    fetchAPOD();
  }, []);

  return (
    <Box p={8} textAlign="center">
      <Heading mb={6}>Welcome to LaunchPoint</Heading>
      <Text fontSize="lg" mb={6}>
        Explore the universe — powered by NASA data.
      </Text>

      {!apod ? (
        <Spinner size="xl" />
      ) : (
        <Box>
          <Image
            src={apod.url}
            alt={apod.title}
            maxH="400px"
            mx="auto"
            borderRadius="md"
            mb={4}
          />
          <Text fontWeight="bold">{apod.title}</Text>
          <Text fontSize="sm" maxW="600px" mx="auto">
            {apod.explanation.slice(0, 180)}...
          </Text>
        </Box>
      )}
    </Box>
  );
}
