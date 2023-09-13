// This file provides a wrapper around fetch, aimed to make authorized api fetches easier. To do this, it will handle
// JWT expiry.

// TODO: Error message for user having no access token different in production?

import { getNewAccessToken, isTokenExpired, NoAccessTokenError } from "./auth";

async function handleAccessToken() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new NoAccessTokenError("There is no access token!");
    }
    if (isTokenExpired(accessToken)) {
        try {
            await getNewAccessToken();
        } catch (error) {
            // Refresh token is expired.
            throw error;
        }
    }
}

async function authorisedPatch<T1, T2>(url: string, body: T1): Promise<T2> {
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
        return Promise.reject(response.status.toString());
    }

    const json: T2 = await response.json();
    return json;
}

async function authorisedPost<T1, T2>(url: string, body: T1): Promise<T2> {
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
        return Promise.reject(new Error(response.status.toString()));
    }

    const json: T2 = await response.json();
    console.log(json);
    return json;
}

async function authorisedPut<T1, T2>(url: string, body: T1): Promise<T2> {
    try {
        await handleAccessToken();
    } catch (error) {
        throw error;
    }

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return Promise.reject(new Error(response.status.toString()));
    }

    const json = await response.json();
    return json;
}

async function authorisedDelete<T>(url: string): Promise<T> {
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
        return Promise.reject(new Error(response.status.toString()));
    }

    const json = await response.json();
    return json;
}

export const authorisedFetchWrapper = {
    patch: authorisedPatch,
    post: authorisedPost,
    put: authorisedPut,
    delete: authorisedDelete,
};
