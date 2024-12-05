import { useEffect, useState } from 'react';
import { account } from './appwriteConfig';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await account.get();
        setUser(response);
      } catch {
        setUser(null); // No user session
      }
    };

    checkUser();
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute