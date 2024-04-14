import {getCurrentUser} from '../@/lib/appwrite/api.ts';
import { IContextType, IUser } from '../types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    $id:'',
    id:'',
    role:'',
    email:'',
    password:'',
    accountid:''
}

const INITIAL_STATE = {
    user:INITIAL_USER,
    isLoading:false,
    isAuthenticated:false,
    setUser:() => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({children}:{children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isLoading, setLoading] =  useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if(currentAccount){
                setUser({
                    $id:'',
                    id: currentAccount.$id,
                    accountid:currentAccount.accountid,
                    role: currentAccount.role,
                    email: currentAccount.email,
                    password:currentAccount.password
                })
                setIsAuthenticated(true);
                return true;
            }
            return false;
        }catch (error){
            console.log(error);
            return false;
        }finally{
            setLoading(false);
        }
    }

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
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);