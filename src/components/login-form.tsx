"use client"; // Indicates that this module is client-side code.

import { signIn, signOut, useSession } from "next-auth/react"; // Import the signIn function from NextAuth for authentication.
import { useSearchParams, useRouter } from "next/navigation"; // Import Next.js navigation utilities.
import { ChangeEvent, useState } from "react"; // Import React hooks for managing component state.

export const LoginForm = () => {

    const { status, data } = useSession();
    console.log(status, data)

    const router = useRouter(); // Initialize the Next.js router.
    const [loading, setLoading] = useState(false); // State for managing loading state.
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    }); // State for form input values.
    const [error, setError] = useState(""); // State for handling errors during authentication.

    const searchParams = useSearchParams(); // Get query parameters from the URL.
    const callbackUrl = "/home" || searchParams.get("callbackUrl") || "/profile"; // Define a callback URL or use a default one.


    return (
        <div className="flex flex-col items-center justify-center w-full px-6 py-8 mx-auto mt-10 bg-white rounded-lg shadow-md dark:bg-gray-800 md:px-16 md:mt-16 lg:px-12">
            <a
                className="flex items-center justify-center w-full py-2 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                style={{ backgroundColor: "#000000" }}
                onClick={() => signIn("github")}
                role="button"
            >
                <img
                    className="pr-2"
                    src="/images/github.png"
                    alt=""
                    style={{ height: "2.2rem" }}
                />
                Continue with GitHub
            </a>
        </div>
    );
};