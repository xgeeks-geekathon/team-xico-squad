"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import sdk from '@stackblitz/sdk'

export function LogoutButton() {
  const { data: session } = useSession();

  console.log(session);
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
  libVersion: string
};

const initialValues: FormValues = {
  libName: "@mui/material",
  issueDescription: "",
  repoName: "horse_repo",
  libVersion: 'latest'
};

function Form() {
  const [loading, setLoading] = useState(false); // State for managing loading state.
  const [formValues, setFormValues] = useState<FormValues>(initialValues); // State for form input values.
  const [error, setError] = useState(""); // State for handling errors during authentication.

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    try {
      setLoading(true); // Set loading state to true.

     const result = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({
          libName: formValues.libName,
          issueDescription: formValues.issueDescription,
          repoName: formValues.repoName,
          libVersion: formValues.libVersion
        }),
      });
      const {username, repoName} = await result.json()
     
        sdk.openGithubProject(`${username}/${repoName}`)
   
    } catch (error: any) {
      setLoading(false); // Set loading state back to false on error.
      setError(error); // Set the error message for any other errors.
    } finally {
      setFormValues(initialValues);
    }
  };

  // Handle input field changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value }); // Update the form input values.
  };

  // Define a CSS class for form inputs.
  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <form onSubmit={onSubmit}>
      {error && <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>}

      {/* Email input field */}
      <div className="mb-6">
        <input
          required
          type="string"
          name="libName"
          value={formValues.libName}
          onChange={handleChange}
          placeholder="Library Name"
          className={`${input_style}`}
        />
      </div>

      <div className="mb-6">
        <input
          required
          type="string"
          name="libVersion"
          value={formValues.libVersion}
          onChange={handleChange}
          placeholder="Library Version"
          className={`${input_style}`}
        />
      </div>

      {/* Password input field */}
      <div className="mb-6">
        <input
          required
          type="string"
          name="issueDescription"
          value={formValues.issueDescription}
          onChange={handleChange}
          placeholder="Issue Description"
          className={`${input_style}`}
        />
      </div>

      <div className="mb-6">
        <input
          required
          type="string"
          name="repoName"
          value={formValues.repoName}
          onChange={handleChange}
          placeholder="Repository Name"
          className={`${input_style}`}
        />
      </div>

      <div>
        <button
          // disabled={loading}
          type="submit"
          // onClick={() => {
          //   fetch("/api/submit", {
          //     method: "POST",
          //     body: JSON.stringify({
          //       libName: "@mui/material",
          //       issueDescription: "at",
          //       repoName: "horse_repo",
          //     }),
          //   });
          // }}
        >
          Submit
        </button>
      </div>
      <button onClick={() => signOut()}>Sign out</button>
    </form>
  );
}
