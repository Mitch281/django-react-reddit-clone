import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired } from "./auth";

export async function fetchPosts(order) {
    let url;
    if (order) {
        url = `https://reddit-clone-backend-restapi.herokuapp.com/api/posts/${order}`;
    } else {
        url = "https://reddit-clone-backend-restapi.herokuapp.com/api/posts/";
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
        url = `https://reddit-clone-backend-restapi.herokuapp.com/api/posts/category=${categoryId}/${order}/`;
    } else {
        url = `https://reddit-clone-backend-restapi.herokuapp.com/api/posts/category=${categoryId}/`;
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
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/categories/");
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function fetchUsersVotesOnPosts() {
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/post-votes/");
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
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/post/id=${idOfThing}/`;
    } else {
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/comment/id=${idOfThing}/`;
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
        apiUrl = "https://reddit-clone-backend-restapi.herokuapp.com/api/post-votes/";
        data = {
            id: uuid_v4(),
            upvote: true,
            downvote: false,
            user: userId,
            post: idOfThing,
        };
    } else {
        apiUrl = "https://reddit-clone-backend-restapi.herokuapp.com/api/comment-votes/";
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
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/post-vote/${voteId}/`;
    } else {
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/comment-vote/${voteId}/`;
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
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/post/id=${idOfThing}/`;
    } else {
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/comment/id=${idOfThing}/`;
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
        apiUrl = "https://reddit-clone-backend-restapi.herokuapp.com/api/post-votes/";
        data = {
            id: uuid_v4(),
            upvote: false,
            downvote: true,
            user: userId,
            post: idOfThing,
        };
    } else {
        apiUrl = "https://reddit-clone-backend-restapi.herokuapp.com/api/comment-votes/";
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
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/post-vote/${voteId}/`;
    } else {
        apiUrl = `https://reddit-clone-backend-restapi.herokuapp.com/api/comment-vote/${voteId}/`;
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
        url = `https://reddit-clone-backend-restapi.herokuapp.com/api/comments/post=${postId}/${order}/`;
    } else {
        url = `https://reddit-clone-backend-restapi.herokuapp.com/api/comments/post=${postId}/`;
    }
    const response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}

export async function fetchUsersVotesOnComments() {
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/comment-votes/");
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
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/comments/", {
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
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/comments/", {
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
        `https://reddit-clone-backend-restapi.herokuapp.com/api/comment/id=${commentId}/user-id=${userIdLoggedIn}/`,
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
    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/posts/", {
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
        `https://reddit-clone-backend-restapi.herokuapp.com/api/post/id=${postId}/user-id=${userIdLoggedIn}/`,
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
        `https://reddit-clone-backend-restapi.herokuapp.com/api/post/id=${postId}/user-id=${userIdLoggedIn}/`,
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

    const response = await fetch("https://reddit-clone-backend-restapi.herokuapp.com/api/categories/", {
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
        `https://reddit-clone-backend-restapi.herokuapp.com/api/comment/id=${commentId}/user-id=${userIdLoggedIn}/`,
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
        `https://reddit-clone-backend-restapi.herokuapp.com/api/post/num-comments/id=${postId}/`
    );
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        throw new Error(response.status);
    }
}
