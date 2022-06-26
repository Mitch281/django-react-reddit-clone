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

export async function postUpvote(
    idOfThing,
    currentNumUpvotes,
    currentNumDownvotes,
    status,
    thingToUpvote
) {
    let data;
    let apiUrl;

    if (thingToUpvote === "post") {
        apiUrl = `${API_ENDPOINT}/post/id=${idOfThing}/`;
    } else {
        apiUrl = `${API_ENDPOINT}/comment/id=${idOfThing}/`;
    }

    // User is going from downvote to upvote.
    if (status === "downvoted") {
        data = {
            num_upvotes: currentNumUpvotes + 1,
            num_downvotes: currentNumDownvotes - 1,
        };
    }

    // User is undoing upvote by pressing upvote again.
    else if (status === "upvoted") {
        data = { num_upvotes: currentNumUpvotes - 1 };
    }

    // User is going from no vote to upvote.
    else {
        data = { num_upvotes: currentNumUpvotes + 1 };
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(apiUrl, {
        method: "PATCH",
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

export async function postUsersUpvote(userId, idOfThing, thingToUpvote) {
    let apiUrl;
    let data;

    if (thingToUpvote === "post") {
        apiUrl = `${API_ENDPOINT}/post-votes/`;
        data = {
            id: uuid_v4(),
            upvote: true,
            downvote: false,
            user: userId,
            post: idOfThing,
        };
    } else {
        apiUrl = `${API_ENDPOINT}/comment-votes/`;
        data = {
            id: uuid_v4(),
            upvote: true,
            downvote: false,
            user: userId,
            comment: idOfThing,
        };
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        return data;
    } else {
        throw new Error(response.status);
    }
}

export async function patchUsersUpvote(status, voteId, thingToUpvote) {
    let data;
    let apiUrl;

    if (thingToUpvote === "post") {
        apiUrl = `${API_ENDPOINT}/post-vote/${voteId}/`;
    } else {
        apiUrl = `${API_ENDPOINT}/comment-vote/${voteId}/`;
    }

    if (status === "no vote") {
        data = { upvote: true };
    } else {
        data =
            status === "downvoted"
                ? { downvote: false, upvote: true }
                : { upvote: false };
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(apiUrl, {
        method: "PATCH",
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

export async function postDownvote(
    idOfThing,
    currentNumUpvotes,
    currentNumDownvotes,
    status,
    thingToDownvote
) {
    let data;
    let apiUrl;

    if (thingToDownvote === "post") {
        apiUrl = `${API_ENDPOINT}/post/id=${idOfThing}/`;
    } else {
        apiUrl = `${API_ENDPOINT}/comment/id=${idOfThing}/`;
    }

    // User is undoing downvote by pressing downvote again.
    if (status === "downvoted") {
        data = { num_downvotes: currentNumDownvotes - 1 };
    }

    // User is going from upvote to downvote.
    else if (status === "upvoted") {
        data = {
            num_upvotes: currentNumUpvotes - 1,
            num_downvotes: currentNumDownvotes + 1,
        };
    }

    // User is going from no vote to downvote.
    else {
        data = { num_downvotes: currentNumDownvotes + 1 };
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(apiUrl, {
        method: "PATCH",
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

export async function postUsersDownvote(userId, idOfThing, thingToDownvote) {
    let data;
    let apiUrl;

    if (thingToDownvote === "post") {
        apiUrl = `${API_ENDPOINT}/post-votes/`;
        data = {
            id: uuid_v4(),
            upvote: false,
            downvote: true,
            user: userId,
            post: idOfThing,
        };
    } else {
        apiUrl = `${API_ENDPOINT}/comment-votes/`;
        data = {
            id: uuid_v4(),
            upvote: false,
            downvote: true,
            user: userId,
            comment: idOfThing,
        };
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        return data;
    } else {
        throw new Error(response.status);
    }
}

export async function patchUsersDownvote(status, voteId, thingToDownvote) {
    let data;
    let apiUrl;

    if (thingToDownvote === "post") {
        apiUrl = `${API_ENDPOINT}/post-vote/${voteId}/`;
    } else {
        apiUrl = `${API_ENDPOINT}/comment-vote/${voteId}/`;
    }

    if (status === "no vote") {
        data = { downvote: true };
    } else {
        data =
            status === "downvoted"
                ? { downvote: false }
                : { downvote: true, upvote: false };
    }

    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(apiUrl, {
        method: "PATCH",
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

export async function postComment(data) {
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

export async function fetchDeletePost(postId, userIdLoggedIn) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(
        `${API_ENDPOINT}/post/id=${postId}/user-id=${userIdLoggedIn}/`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error(response.status);
    }
}

export async function editPost(newPostContent, postId, userIdLoggedIn) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await getNewAccessTokenIfExpired(accessToken);
    } catch (error) {
        throw error;
    }

    const response = await fetch(
        `${API_ENDPOINT}/post/id=${postId}/user-id=${userIdLoggedIn}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content: newPostContent }),
        }
    );

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
