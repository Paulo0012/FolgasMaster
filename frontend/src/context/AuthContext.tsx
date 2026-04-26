import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Adicione 'loading' na Interface
interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean; // <-- Adicione aqui
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // <-- Começa como true

  useEffect(() => {
    const token = localStorage.getItem('@FolgasMaster:token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // <-- Terminou de verificar, para o loading
  }, []);

  const login = (token: string) => {
    localStorage.setItem('@FolgasMaster:token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('@FolgasMaster:token');
    setIsAuthenticated(false);
  };

  return (
    // 2. Passe o 'loading' no Provider
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 // 3. Atualize o hook para refletir a nova interface
export const useAuth = () => useContext(AuthContext);