import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Button,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Badge,
} from "@chakra-ui/react";

const PAGE_SIZE = 24;

export default function MarsFeed({ rover, page, onPageChange }) {
  const [photos, setPhotos] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = encodeURIComponent(`mars ${rover} rover`);
        const url = `https://images-api.nasa.gov/search?q=${query}&media_type=image&page_size=${PAGE_SIZE}&page=${page}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setPhotos(data.collection.items || []);
        setTotalHits(data.collection.metadata?.total_hits || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [rover, page]);

  const handleOpen = (photo) => {
    setSelected(photo);
    onOpen();
  };

  const totalPages = Math.ceil(totalHits / PAGE_SIZE);

  if (loading) {
    return (
      <Flex justify="center" py={16}>
        <Spinner size="xl" color="orange.400" thickness="4px" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Failed to load photos</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (photos.length === 0) {
    return (
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <AlertTitle>No photos found</AlertTitle>
        <AlertDescription>No results for {rover} rover.</AlertDescription>
      </Alert>
    );
  }

  const thumbnailFor = (photo) => photo?.links?.[0]?.href ?? "";
  const metaFor = (photo) => photo?.data?.[0] ?? {};

  return (
    <Box>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={3} mb={6}>
        {photos.map((photo) => {
          const meta = metaFor(photo);
          return (
            <Box
              key={meta.nasa_id}
              cursor="pointer"
              borderRadius="md"
              overflow="hidden"
              bg="bg.elevated"
              _hover={{ opacity: 0.85, transform: "scale(1.02)" }}
              transition="all 0.15s"
              onClick={() => handleOpen(photo)}
            >
              <Image
                src={thumbnailFor(photo)}
                alt={meta.title}
                w="100%"
                h="120px"
                objectFit="cover"
                loading="lazy"
              />
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Pagination */}
      <Flex justify="center" align="center" gap={4}>
        <Button
          size="sm"
          onClick={() => onPageChange(page - 1)}
          isDisabled={page <= 1}
          colorScheme="orange"
          variant="outline"
        >
          Prev
        </Button>
        <Text color="text.secondary" fontSize="sm">
          Page {page} of {totalPages.toLocaleString()}
        </Text>
        <Button
          size="sm"
          onClick={() => onPageChange(page + 1)}
          isDisabled={page >= totalPages}
          colorScheme="orange"
          variant="outline"
        >
          Next
        </Button>
      </Flex>

      {/* Photo Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pr={10} fontSize="md">
            {metaFor(selected)?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Image
              src={thumbnailFor(selected)}
              alt={metaFor(selected)?.title}
              w="100%"
              borderRadius="md"
              mb={4}
            />
            {metaFor(selected)?.date_created && (
              <Badge colorScheme="orange" mb={2}>
                {new Date(metaFor(selected).date_created).toLocaleDateString()}
              </Badge>
            )}
            {metaFor(selected)?.description && (
              <Text color="text.secondary" fontSize="sm" mt={2}>
                {metaFor(selected).description}
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
