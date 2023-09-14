import { SetStateAction } from "react";

export type UserContextType = {
    loggedIn: boolean;
    logout: () => void;
    reLogin: () => Promise<void>;
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
    setUserIdLoggedIn: React.Dispatch<SetStateAction<string>>;
    setUsernameLoggedIn: React.Dispatch<SetStateAction<string>>;
    userIdLoggedIn: string;
    usernameLoggedIn: string;
};
