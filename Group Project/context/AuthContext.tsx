import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../@/lib/appwrite/api.ts';
import { IContextType, IUser } from '../types';

export const INITIAL_USER: IUser = {
    $id: '',
    id: '',
    role: '',
    email: '',
    password: '',
    accountid: ''
};

const INITIAL_STATE: IContextType = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {}, // Function initially set to empty function
    setIsAuthenticated: () => {}, // Function initially set to empty function
    checkAuthUser: async () => false as boolean // Return type explicitly specified as boolean
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if (currentAccount) {
                setUser({
                    $id: '',
                    id: currentAccount.$id,
                    accountid: currentAccount.accountid,
                    role: currentAccount.role,
                    email: currentAccount.email,
                    password: currentAccount.password
                });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if (
            cookieFallback === "[]" ||
            cookieFallback === null ||
            cookieFallback === undefined
        ) {
            navigate("/login");
        }

        checkAuthUser();
    }, []);

    const value: IContextType = {
        user,
        setUser,
        isLoading,
        isAuthenticated: false, // Adding isAuthenticated property with initial value
        setIsAuthenticated: () => {}, // Function initially set to empty function
        checkAuthUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
