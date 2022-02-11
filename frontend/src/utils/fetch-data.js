import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired } from "./auth";

export async function postUpvote(idOfThing, currentNumUpvotes, currentNumDownvotes, status, thingToUpvote) {
  let data;
  let apiUrl;
  
  if (thingToUpvote === "post") {
    apiUrl = `http://localhost:8000/api/post/id=${idOfThing}/`;
  } else {
    apiUrl = `http://localhost:8000/api/comment/id=${idOfThing}/`;
  }

  // User is going from downvote to upvote.
  if (status === "downvoted") {
    data = {num_upvotes: currentNumUpvotes + 1, num_downvotes: currentNumDownvotes - 1}
  }

  // User is undoing upvote by pressing upvote again.
  else if (status === "upvoted") {
    data = {num_upvotes: currentNumUpvotes - 1}
  } 

  // User is going from no vote to upvote.
  else {
    data = {num_upvotes: currentNumUpvotes + 1}
  }

  const accessToken = localStorage.getItem("accessToken");
  try {
    await getNewAccessTokenIfExpired(accessToken);
  } catch(error) {
    throw error;
  }

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Berer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(response.status);
  }
}

export async function postUsersUpvote(userId, idOfThing, thingToUpvote) {
  let apiUrl;
  let data;

  if (thingToUpvote === "post") {
    apiUrl = "http://localhost:8000/api/post-votes/";
    data = {
      id: uuid_v4(),
      upvote: true,
      downvote: false,
      user: userId,
      post: idOfThing
    }
  } else {
    apiUrl = "http://localhost:8000/api/comment-votes/";
    data = {
      id: uuid_v4(),
      upvote: true,
      downvote: false,
      user: userId,
      comment: idOfThing
    }
  }

  const accessToken = localStorage.getItem("accessToken");
  try {
    await getNewAccessTokenIfExpired(accessToken);
  } catch(error) {
    throw error;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
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
    apiUrl = `http://localhost:8000/api/post-vote/${voteId}/`;
  } else {
    apiUrl = `http://localhost:8000/api/comment-vote/${voteId}/`;
  }

  if (status === "no vote") {
    data = {upvote: true}
  }
  else {
    data = (status === "downvoted") ? {downvote: false, upvote: true} : {upvote: false};
  }

  const accessToken = localStorage.getItem("accessToken");
  try {
    await getNewAccessTokenIfExpired(accessToken);
  } catch(error) {
    throw error;
  }

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(response.status);
  }
}

export async function postDownvote(idOfThing, currentNumUpvotes, currentNumDownvotes, status, thingToDownvote) {
  let data;
  let apiUrl;

  if (thingToDownvote === "post") {
    apiUrl = `http://localhost:8000/api/post/id=${idOfThing}/`;
  } else {
    apiUrl = `http://localhost:8000/api/comment/id=${idOfThing}/`;
  }

  // User is undoing downvote by pressing downvote again.
  if (status === "downvoted") {
    data = {num_downvotes: currentNumDownvotes - 1};
  }

  // User is going from upvote to downvote.
  else if (status === "upvoted") {
    data = {num_upvotes: currentNumUpvotes - 1, num_downvotes: currentNumDownvotes + 1};
  }

  // User is going from no vote to downvote.
  else {
    data = {num_downvotes: currentNumDownvotes + 1};
  }

  const accessToken = localStorage.getItem("accessToken");
  try {
    await getNewAccessTokenIfExpired(accessToken);
  } catch(error) {
    throw error;
  }
  
  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(response.status);
  }
}

export async function postUsersDownvote(userId, idOfThing, thingToDownvote) {
  let data;
  let apiUrl;

  if (thingToDownvote === "post") {
    apiUrl = "http://localhost:8000/api/post-votes/"
    data = {
      id: uuid_v4(),
      upvote: false,
      downvote: true,
      user: userId,
      post: idOfThing
    }
  } else {
    apiUrl = "http://localhost:8000/api/comment-votes/"
    data = {
      id: uuid_v4(),
      upvote: false,
      downvote: true,
      user: userId,
      comment: idOfThing
    }
  }

  const accessToken = localStorage.getItem("accessToken");
  try {
    await getNewAccessTokenIfExpired(accessToken);
  } catch(error) {
    throw error;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
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
    apiUrl = `http://localhost:8000/api/post-vote/${voteId}/`
  } else {
    apiUrl = `http://localhost:8000/api/comment-vote/${voteId}/`;
  }

  if (status === "no vote") {
    data = {downvote: true}
  }
  else {
    data = (status === "downvoted") ? {downvote: false} : {downvote: true, upvote: false};
  }

  const accessToken = localStorage.getItem("accessToken");
  try {
    await getNewAccessTokenIfExpired(accessToken);
  } catch(error) {
    throw error;
  }

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(response.status);
  }
}
