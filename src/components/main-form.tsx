"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import sdk from "@stackblitz/sdk";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { useSnackbar } from "notistack";

export function MainForm() {
  return (
    <>
      <Form />
    </>
  );
}

type FormValues = {
  libName: string;
  issueDescription: string;
  repoName: string;
  libVersion: string;
};

const initialValues: FormValues = {
  libName: "",
  issueDescription: "",
  repoName: "",
  libVersion: "latest",
};

function Form() {
  const [formValues, setFormValues] = useState<FormValues>(initialValues); // State for form input values.
  const [formStatus, setFormStatus] = useState<"pending" | "idle" | "success" | "error">(
    "idle",
  );

  const { enqueueSnackbar } = useSnackbar();

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    try {
      setFormStatus("pending");
      const result = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({
          libName: formValues.libName,
          issueDescription: formValues.issueDescription,
          repoName: formValues.repoName,
          libVersion: formValues.libVersion,
        }),
      });
      setFormStatus("success");
      setFormValues(initialValues);

      const { username, repoName } = await result.json();

      sdk.openGithubProject(`${username}/${repoName}`);

      enqueueSnackbar("Project created successfully", { variant: "success" });
    } catch (error: any) {
      setFormStatus("error");
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      onSubmit={onSubmit}
    >
      <Stack
        spacing={2}
        sx={{ display: "flex", maxWidth: 800, width: "100%", alignItems: "center" }}
      >
        <TextField
          value={formValues.libName}
          fullWidth
          required
          label="Library Name"
          onChange={(e) => {
            setFormValues({ ...formValues, libName: e.target.value });
          }}
        />

        <TextField
          value={formValues.libVersion}
          required
          fullWidth
          label="Library Version"
          onChange={(e) => {
            setFormValues({ ...formValues, libVersion: e.target.value });
          }}
        />

        <TextField
          value={formValues.issueDescription}
          required
          fullWidth
          label="Issue Description"
          onChange={(e) => {
            setFormValues({ ...formValues, issueDescription: e.target.value });
          }}
        />

        <TextField
          value={formValues.repoName}
          required
          fullWidth
          label="Repository Name"
          onChange={(e) => {
            setFormValues({ ...formValues, repoName: e.target.value });
          }}
        />

        <Stack spacing={1}>
          <Button variant="contained" type="submit" disabled={formStatus === "pending"}>
            Submit
          </Button>

          <Button
            color="error"
            disabled={formStatus === "pending"}
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
