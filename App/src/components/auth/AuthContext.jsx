import {jwtDecode} from "jwt-decode";
import {createContext, useContext, useEffect, useState} from "react";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserFromToken = () => {
        const jwtToken = localStorage.getItem("access_token");
        if (jwtToken) {
            const decoded = jwtDecode(jwtToken);
            setUser({
                username: decoded.sub,
                roles: decoded.scopes,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUserFromToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;