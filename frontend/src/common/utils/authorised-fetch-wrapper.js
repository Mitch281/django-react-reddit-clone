// This file provides a wrapper around fetch, aimed to make authorized api fetches easier. To do this, it will handle
// JWT expiry.

import { getNewAccessToken, isTokenExpired } from "./auth";

async function handleAccessToken() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        return Promise.reject("No access token!");
    }
    if (isTokenExpired(accessToken)) {
        try {
            await getNewAccessToken();
        } catch (error) {
            // Refresh token is expired.
            return Promise.reject(error);
        }
    }
}

async function authorisedPatch(url, body) {
    try {
        await handleAccessToken();
    } catch (error) {
        return Promise.reject(error);
    }

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return response;
}

async function authorisedPost(url, body) {
    try {
        await handleAccessToken();
    } catch (error) {
        return Promise.reject(error);
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return response;
}

async function authorisedDelete(url) {
    try {
        await handleAccessToken();
    } catch (error) {
        return Promise.reject(error);
    }

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

    if (!response.ok) {
        return Promise.reject(response.status);
    }

    return response;
}

export const authorisedFetchWrapper = {
    patch: authorisedPatch,
    post: authorisedPost,
    delete: authorisedDelete
};
