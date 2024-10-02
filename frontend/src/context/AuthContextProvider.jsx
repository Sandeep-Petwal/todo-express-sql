import { createContext } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, userId: null, email: null, username: null });
    const [updatedUser, setUpdatedUser] = useState({
        Updatedsername: null,
        UpdatedEemail: null
    });
    const login = (id, email, username) => {
        setUser({
            isLoggedIn: true,
            userId: id,
            email,
            username
        });
    };


    const updateTheUser = (username, email) => {
        setUpdatedUser({ Updatedsername: username, UpdatedEemail: email })
    }


    const logout = () => {
        setUser({
            isLoggedIn: false,
            userId: null,
        });
    };

    const setUserId = (userId) => {
        setUser({
            isLoggedIn: false,
            userId: userId
        })
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, setUserId, updatedUser, updateTheUser }}>
            {children}
        </AuthContext.Provider>
    );
};
