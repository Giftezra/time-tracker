import { useState, useEffect } from 'react';

const [isLoading, setIsLoading] = useState(true);
const [authToken, setAuthToken] = useState<string | null>(null);

const loadToken = async (): Promise<string | null> => {
    if (authToken === null) {}
  return 'your-token';
};

useEffect(() => {
  try {
    setIsLoading(true);
    const getToken = async () => {
      const token = await loadToken();
      if (token) {
        setAuthToken(token);
        setIsLoading(false);
      }
    };
    getToken();
  } catch (e) {
    console.log(e);
  }
}, []);
