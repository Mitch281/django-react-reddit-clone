import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired } from "./auth";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export async function fetchPosts(order) {
    let url;
    if (order) {
        url = `${API_ENDPOINT}/posts/${order}`;
    } else {
        url = `${API_ENDPOINT}/posts/`;
    }
    const response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function fetchPostsByCategory(order, categoryId) {
    let url;
    if (order) {
        url = `${API_ENDPOINT}/posts/category=${categoryId}/${order}/`;
    } else {
        url = `${API_ENDPOINT}/posts/category=${categoryId}/`;
    }
    const response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function fetchCategories() {
    const response = await fetch(`${API_ENDPOINT}/categories/`);
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function fetchComments(order, postId) {
    let url;
    if (order) {
        url = `${API_ENDPOINT}/comments/post=${postId}/${order}/`;
    } else {
        url = `${API_ENDPOINT}/comments/post=${postId}/`;
    }
    const response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function postReplyToComment(data) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }
    const response = await fetch(`${API_ENDPOINT}/comments/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(response.status);
    }
}

export async function editComment(
    newCommentContent,
    commentId,
    userIdLoggedIn
) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(
        `${API_ENDPOINT}/comment/id=${commentId}/user-id=${userIdLoggedIn}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content: newCommentContent }),
        }
    );
    if (!response.ok) {
        throw new Error(response.status);
    }
}

export async function postPost(data) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }
    const response = await fetch(`${API_ENDPOINT}/posts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(response.status);
    }
}

export async function postCategory(data) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(`${API_ENDPOINT}/categories/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(response.status);
    }
}

export async function fetchDeleteComment(commentId, userIdLoggedIn) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(
        `${API_ENDPOINT}/comment/id=${commentId}/user-id=${userIdLoggedIn}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ deleted: true }),
        }
    );
    if (!response.ok) {
        throw new Error(response.status);
    }
}

export async function fetchNumberOfCommentsOnPost(postId) {
    const response = await fetch(
        `${API_ENDPOINT}/post/num-comments/id=${postId}/`
    );
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}
