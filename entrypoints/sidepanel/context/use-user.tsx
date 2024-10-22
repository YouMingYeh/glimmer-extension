import React, { createContext, useContext, useEffect, useState } from "react";

const BASE_URL =
  "https://workers-d1-hono-drizzle-template.ym911216.workers.dev";
// Define the shape of the user data
interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  // Add other user properties as needed
}

// Define the shape of the context value
interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<{ data: any; error: Error | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: Error | null }>;
}

// Create the context with a default value
const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
});

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component to fetch and provide user data
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/users/sign-in`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    });
    const status = response.status;
    const data = await response.json();

    if (status === 200) {
      const { data: user } = await getUser();
      if (!user) {
        throw new Error("Failed to fetch user data");
      }
      setUser(user);
      setLoading(false);
      return { data: data, error: null };
    } else {
      setLoading(false);
      return { data: null, error: new Error(data.message) };
    }
  };

  const signOut = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/users/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    });
    const status = response.status;
    const data = await response.json();
    if (status === 200) {
      setUser(null);
      setLoading(false);
      return { data: data, error: null };
    } else {
      setLoading(false);
      return { data: null, error: new Error(data.message) };
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/users/sign-up`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    });
    const status = response.status;
    const data = await response.json();
    if (status === 200) {
      setLoading(false);
      return { data: data, error: null };
    } else {
      setLoading(false);
      return { data: null, error: new Error(data.message) };
    }
  };

  useEffect(() => {
    // Fetch user data from the remote backend
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/users`, {
          credentials: "include",
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, error, signIn, signOut, signUp }}
    >
      {children}
    </UserContext.Provider>
  );
};

const getUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      credentials: "include",
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    const user = {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
    return { data: user, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
