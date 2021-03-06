import { toast } from "react-toastify";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export class NoAccessTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

// TODO: Figure out why instanceof check not working!! For now, we will check using the name property.
export class CantGetNewAccessTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export function isTokenExpired(token) {
    if (!token) {
        return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000;
    return expired;
}

export async function verifyCurrentUser() {
    const response = await fetch(`${API_ENDPOINT}/current-user/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    if (response.ok) {
        return response;
    } else {
        throw new CantGetNewAccessTokenError("Cannot get new access token!");
    }
}

export async function getNewAccessToken() {
    const response = await fetch(`${API_ENDPOINT}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: localStorage.getItem("refreshToken") }),
    });
    if (response.ok) {
        const json = await response.json();
        const newAccessToken = json.access;
        localStorage.setItem("accessToken", newAccessToken);
    } else {
        // Promise.reject(new CantGetNewAccessTokenError("Can't get new access token."));
        throw new CantGetNewAccessTokenError("Can't get new access token!");
    }
}

export async function login(username, password) {
    const response = await fetch(`${API_ENDPOINT}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
    });
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function signup(username, password) {
    const response = await fetch(`${API_ENDPOINT}/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
    });
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export function renderErrorOnRequest(error, logout, navigate) {
    if (error.name === "CantGetNewAccessTokenError") {
        toast.error("Session expired! Please login again.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        logout();
        navigate("/login/");
    } else if (error.name === "NoAccessTokenError") {
        toast.error("You must be logged in to perform this action!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else {
        toast.error(error.message, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}

// Although the logic for this function is similar as the "handleErrorOnRequest" function, we must make this a seperate function.
// This is because since we call this function in the root App component, we cannot import and use the useNavigate hook from react
// router dom. This is due to the fact that the hook can only be used inside a Router component. We also do not handle no access
// token because chances are the user does not intend to relogin if they do not have an access token.
export function handleCantReLoginError(error, logout) {
    // If there is no access token, there is no reason for the user to know about re logging in.
    if (localStorage.getItem("accessToken") === null) {
        return;
    }
    if (error.name === "CantGetNewAccessTokenError") {
        toast.error("Session expired! Please login again.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        logout();
    } else {
        toast.error("Could not authenticate user! Please login again.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        logout();
    }
}

// This is to be used when fetching from database mainly in slice files.
export function handleFetchError(error, message) {
    if (
        error instanceof CantGetNewAccessTokenError ||
        error instanceof NoAccessTokenError
    ) {
        throw error;
    } else {
        throw new Error(message);
    }
}
