export class CantGetNewAccessTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = CantGetNewAccessTokenError;
    }
}

export class NoAccessTokenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NoAccessTokenError';
    }
}
  

function isTokenExpired(token) {
    if (!token) {
        throw new NoAccessTokenError("Access token does not exist");
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
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/current-user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    });
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

// This function gets a new access token if necessary.
export async function getNewAccessTokenIfExpired(accessToken) {
    const expired = isTokenExpired(accessToken);
    if (expired) {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refresh: refreshToken})
        });
        if (response.ok) {
            const json = await response.json();
            const newAccessToken = json.access;
            localStorage.setItem("accessToken", newAccessToken);
        } else {
            throw new CantGetNewAccessTokenError("Can't get new access token");
        }
    }
}

export async function login(username, password) {
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/token/", {
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
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/users/", {
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
