"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";
import { Button, Typography, Stack, Avatar } from "@mui/material";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={2}
      sx={{ textAlign: "center" }}
    >
      {session ? (
        <>
          <Avatar
            src={session.user?.image as string}
            sx={{ width: 80, height: 80, marginTop: 2 }}
          />
          <Typography variant="h4" color="#00695c">
            Welcome back, {session.user?.name}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => signOut()}
            sx={{ paddingX: 1, paddingY: 1 }}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" color="primary.main">
            Welcome to Brakes Plus Chatbot
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Button variant="outlined" onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
            <Button variant="outlined" onClick={() => signIn("github")}>
              Sign in with GitHub
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Dashboard;
