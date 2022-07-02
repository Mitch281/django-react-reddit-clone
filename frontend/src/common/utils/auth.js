const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export class CantGetNewAccessTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = CantGetNewAccessTokenError;
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    });
    if (response.ok) {
        return response;
    } else {
        throw new Error(response.status);
    }
}

export async function getNewAccessToken() {
    const response = await fetch(`${API_ENDPOINT}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({refresh: localStorage.getItem("refreshToken")})
    });
    if (response.ok) {
        const json = await response.json();
        const newAccessToken = json.access;
        localStorage.setItem("accessToken", newAccessToken);
    } else {
        Promise.reject(new CantGetNewAccessTokenError("Can't get new access token."));
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
