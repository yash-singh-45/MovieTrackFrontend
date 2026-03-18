import React, { createContext, useEffect, useState } from 'react'


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const getProfile = async () => {
            setLoading(true);

            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://cinetrack-production-8848.up.railway.app/api/users/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUser(data);
                } else {
                    localStorage.clear();
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        getProfile();
    }, []);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        setUser(data.user || { id: data.userId });
    };

    const logout = () => {
    localStorage.clear();
    setUser(null);
  };


    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;