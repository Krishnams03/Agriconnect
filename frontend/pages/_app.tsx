import { useState, useEffect, createContext, ReactNode } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "@/components/Loader"; // Import the new Loader component
import "@/app/globals.css"; // Adjust path to your styles

// Define a type for user data
interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // Allow additional properties
}

// Define props for the App component
interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

// Create a UserContext with type annotations
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false); // For page transition loading
  const router = useRouter();

  useEffect(() => {
    // Fetch user session data
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>("http://localhost:5000/api/auth/user", {
          withCredentials: true, // Include credentials if needed
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Handle page transitions
    const handleStart = () => setIsPageLoading(true);
    const handleComplete = () => setIsPageLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isPageLoading && <Loader />} {/* Use the new Loader component */}
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
