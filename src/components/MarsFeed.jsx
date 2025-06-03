import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";

function MarsFeed() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const apiKey = import.meta.env.VITE_NASA_API_KEY;
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setPhotos(data.photos.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch Mars Photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      {photos.map((photo) => (
        <Box key={photo.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Image src={photo.img_src} alt="Mars Rover" width="100%" />
          <Box p={4} bg="gray.700" color="white">
            <Text fontWeight="bold">Rover: {photo.rover.name}</Text>
            <Text>Camera: {photo.camera.full_name}</Text>
            <Text>Date: {photo.earth_date}</Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default MarsFeed;
