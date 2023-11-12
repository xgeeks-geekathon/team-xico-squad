"use client"; // Indicates that this module is client-side code.

import { signIn, signOut, useSession } from "next-auth/react"; // Import the signIn function from NextAuth for authentication.
import { useSearchParams, useRouter } from "next/navigation"; // Import Next.js navigation utilities.
import { ChangeEvent, useState } from "react"; // Import React hooks for managing component state.
import { Box, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export const LoginForm = () => {
  const { status, data } = useSession();
  console.log(status, data);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button
        variant="contained"
        onClick={() => signIn("github")}
        endIcon={<GitHubIcon />}
      >
        Continue with
      </Button>
    </Box>
  );
};
