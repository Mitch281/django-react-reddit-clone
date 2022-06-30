import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired } from "./auth";

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
