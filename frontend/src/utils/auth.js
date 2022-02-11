function isTokenExpired(token) {
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

// This function gets a new access token if necessary. It will return true either if a new access token is successfully
// retreived or we do not need to get a new access token.
export async function getNewAccessTokenIfExpired(accessToken) {
    const expired = isTokenExpired(accessToken);
    if (expired) {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await fetch("http://localhost:8000/api/token/refresh/", {
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
            throw new Error(response.status);
        }
    }
}
