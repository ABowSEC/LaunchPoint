import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  chakra,
  Text,
  Image,
  VStack,
  SimpleGrid,
  Spinner,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';//images



export default function SolViewer() {
  const { solId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const MotionBox = motion(chakra.div);

  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solId}&api_key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        setPhotos(data.photos.slice(0, 6));
      } catch (error) {
        console.error("Error fetching Sol photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [solId]);

  return (
    <Box py={10} px={6}>
      <Breadcrumb mb={6} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/mars">Mars</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Sol {solId}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={6}>
        <Heading color="red.500">Photos from Sol {solId}</Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : photos.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {photos.map((photo, index) => (
        <MotionBox
            key={photo.id}
            bg={bg}
            borderRadius="md"
            overflow="hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >   
            <Image src={photo.img_src} alt="Mars Rover" width="100%" />
            <Box p={4}>
                <Text fontWeight="bold">{photo.rover.name}</Text>
                <Text>{photo.camera.full_name}</Text>
                <Text fontSize="sm">{photo.earth_date}</Text>
            </Box>
        </MotionBox>
            ))}
          </SimpleGrid>
        ) : (
          <Text>No images found for Sol {solId}</Text>
        )}
      </VStack>
    </Box>
  );
}
