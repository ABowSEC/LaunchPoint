import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  IconButton,
  Input,
  VStack,
  Text,
  useDisclosure,
  useColorModeValue,
  Spinner
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Bot } from "lucide-react";

export default function ChatBotDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };
  const updatedMessages = [
    { role: "system", content: "You are HALP-9000, a calm, intelligent, and slightly unsettling AI assistant aboard a deep space mission. Respond with clinical precision and calm demeanor, like HAL 9000 from 2001: A Space Odyssey." },
    ...messages,
    userMessage
  ];

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OpenAI API Key in .env");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: updatedMessages
      })
    });

    const data = await res.json();
    console.log("OpenAI response:", data);

    const reply = data.choices?.[0]?.message;
    if (reply) {
      setMessages((prev) => [...prev, reply]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm afraid I didn't understand that, Commander."
        }
      ]);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "There was an error contacting HALP-9000. Please verify the AI core is online."
      }
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <IconButton
        icon={<Box
          as="img"
          src="/hal9000.png"
          alt="HAL 9000"
          borderRadius="full"
          boxSize="30px" 
          />
        }
        variant="ghost"
        colorScheme="teal"
        ref={btnRef}
        onClick={onOpen}
        aria-label="Chatbot"
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue("white", "gray.800")}> 
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Ask HAL</DrawerHeader>

          <DrawerBody>
            <VStack align="stretch" spacing={4} h="full">
              <Box flex={1} overflowY="auto">
                {messages.map((msg, i) => (
                  <Box
                    key={i}
                    bg={msg.role === "user" ? "teal.100" : "gray.100"}
                    color="gray.800"
                    p={3}
                    borderRadius="md"
                    mb={2}
                  >
                    <Text fontSize="sm" fontWeight="bold">{msg.role}</Text>
                    <Text>{msg.content}</Text>
                  </Box>
                ))}
                {loading && <Spinner size="sm" color="teal.500" />}
              </Box>

              <Input
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <Button onClick={handleSend} colorScheme="teal" isDisabled={!input.trim()}>
                Send
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
