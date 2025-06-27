import {
  Box,Heading,Text,useColorModeValue,
  VStack,HStack,Stack,
  Container,
  Divider,
  Button,
  SimpleGrid,
  Card,CardBody,
  Breadcrumb,BreadcrumbItem,BreadcrumbLink,
  Spinner,
  Tag, TagLeftIcon,
  Input, useToast
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// MarsPage allows the user to choose a Martian sol (day) from the Curiosity rover's photo log
export default function MarsPage() {
  const [availableSols, setAvailableSols] = useState([]); // List of sols with available photos
  const [sol, setSol] = useState(null);                   // Currently selected sol
  const [loading, setLoading] = useState(true);           // Loading state for the manifest
  const[newestSol, setNewestSol] = useState(null);
  const [userSolInput,setUserSolInput]= useState("")
  const toast = useToast();
  const navigate = useNavigate(); // Router navigation hook

  // Color theme
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("red.400", "red.800");

  // Fetch list of sols with photos when the page loads
  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        
        // Extract only the sol numbers that have photos
        const solsWithPhotos = data.photo_manifest.photos.map((entry) => entry.sol);
        setAvailableSols(solsWithPhotos);

        const latest = Math.max(...solsWithPhotos)
        setSol(latest); // Default to newest sol available
        setNewestSol(latest);
      } catch (err) {
        console.error("Error fetching manifest:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManifest();
  }, []);

  //User input fixer
  const findClosestSol = (input) => {
  const target = parseInt(input);
  if (isNaN(target)) return null;

  let closest = availableSols[0];
  let minDiff = Math.abs(target - closest);

  for (let s of availableSols) {
    let diff = Math.abs(target - s);
    if (diff < minDiff) {
      minDiff = diff;
      closest = s;
    }
  }

  return closest;
};

  // Handle sol selection from dropdown
  //const handleSelect = (e) => {
    //const selected = e.target.value;
    //setSol(selected);
    //navigate(`/mars/sol/${selected}`); // Redirect to SolViewer page
  //};

  return (
    <Container maxW="8xl" py={8}>
      {/* Breadcrumb for navigation context */}
      <Breadcrumb mb={6} fontSize="sm" color={subTextColor}>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/mars">Mars</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main page content */}
      <VStack spacing={9} align="stretch">
        {/* Page heading */}
        <Box textAlign="center">
          <Heading as="h1" size="3xl" color="red.600" mx="auto" my={6}>
            Mars Rover Photos
          </Heading>
          <Tag size="lg" colorScheme="red" variant="solid" px={3} py={2} borderRadius="full" mx="auto" my={3}>
            <TagLeftIcon boxSize="20px" as={CalendarIcon}/>
            Choose a Sol with Photos
          </Tag>
          <Input placeholder="Enter Sol Number" value={userSolInput} onChange={(e)=> setUserSolInput(e.target.value)} bg={useColorModeValue("white","gray.700")}/>
          <Button colorScheme="red"
            onClick={() => {const closest = findClosestSol(userSolInput);
              if(closest !== null){
                navigate(`/mars/sol/${closest}`);
              } else{
                toast({
                  title:"Invalid Sol",
                  description:"Try Another Sol",
                  status:"error",
                  duration:3000,
                  isClosable:true,

                });
              }
            }}
          mx="auto" my={2}>
            View Closest Sol
          </Button>
          
          
          <Divider mt={6} borderColor={dividerColor} />

          <Text fontSize="lg" color={subTextColor} maxW="600px" mx="auto" mt={4}>
            Select a Martian day where NASA's Curiosity rover captured photos.
          </Text>

        </Box>

        {/* Dropdown for selecting sol */}
        <Box w="100%" maxW="400px" mx="auto">
          <Heading size="md" textAlign="center" mb={2} color={textColor}>
            Most Recent Sols To Date
          </Heading>

          {/* Show spinner while loading sols */}
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <>
            <SimpleGrid columns={[1,2,3]} spacing = {4}>
              {availableSols.slice(-12).reverse().map((val) => (
                <Card key={val} border="1px solid" borderColor={sol === val ? "red.500" : "gray.200"} bg={useColorModeValue("white","gray.800")} shadow ={sol===val ? "xl":"md"}>
                  <CardBody>
                    <Stack spacing={3} align="center">
                      <Heading size="md" color= "red.600">
                        Sol {val}
                      </Heading>
                      <Button colorScheme="red" size="sm" onClick={() => navigate(`/mars/sol/${val}`)}>
                        View Photos
                      </Button>
                    </Stack>
                  </CardBody>
                  
                </Card>
              ))}
            </SimpleGrid>

            </>// Parent Element
          )}
        </Box>
      </VStack>
    </Container>
  );
}
