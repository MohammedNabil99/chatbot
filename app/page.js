"use client";

import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I am the virtual assistant for brake plus to help you with all your car servicing needs! How can I assist you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false); // State for typing animation
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setIsTyping(true); // Set typing state to true

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsTyping(false); // Set typing state to false
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default action of Enter key
      sendMessage();
    }
  };

  if (status === "loading") {
    // Optional: You can display a loading message or spinner while the session is loading
    return <div>Loading...</div>;
  }

  if (!session) {
    // If there's no session, prompt the user to sign in
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{ textAlign: "center", p: 2 }}
      >
        <Typography variant="h3" gutterBottom color="purple">
          Welcome to Brakes Plus Chatbot
        </Typography>
        <Button variant="contained" onClick={() => signIn()}>
          Sign in
        </Button>
      </Box>
    );
  }

  return (
    <main className="max-w-7xl mx-auto my-12 space-y-5">
      <Dashboard />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          p={1}
          color="#fb8c00"
          sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          Brakes Plus Virtual Assistant
        </Typography>
        <Stack
          direction="column"
          width={{ xs: "100%", sm: "90%", md: "600px" }}
          height={{ xs: "80vh", md: "650px" }}
          border="1px solid black"
          p={2}
          spacing={2} // Adjust spacing to fit the layout
          sx={{
            overflowY: "auto",
            maxHeight: { xs: "80vh", md: "650px" },
            borderRadius: 4,
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            textOverflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                  sx={{
                    maxWidth: "80%",
                    wordWrap: "break-word",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box
                display="flex"
                justifyContent="flex-start"
                p={2}
                pt={0} // Adjust padding top to align with the last message
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Typing{".".repeat((Date.now() / 500) % 4)}
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </main>
  );
}
