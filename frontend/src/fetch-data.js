import { v4 as uuid_v4 } from "uuid";

export async function postUpvoteToPost(postId, currentNumUpvotes, currentNumDownvotes, status, thingToUpvote) {
    let data;
    let apiUrl;
    
    if (thingToUpvote === "post") {
      apiUrl = `http://localhost:8000/api/post/id=${postId}/`;
    } else {
      // comment url.
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
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
        return false;
    }
    return true;
}

export async function postUsersUpvote(userId, postId, thingToUpvote) {
  let apiUrl;
  let data;

  if (thingToUpvote === "post") {
    apiUrl = "http://localhost:8000/api/post-votes/";
    data = {
      id: uuid_v4(),
      upvote: true,
      downvote: false,
      user: userId,
      post: postId
    }
  } else {
    // comment url.
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    return false;
  }
  return {result: true, data: data};
}

export async function patchUsersUpvote(status, postVoteId, thingToUpvote) {
  let data;
  let apiUrl;

  if (thingToUpvote === "post") {
    apiUrl = `http://localhost:8000/api/post-vote/${postVoteId}/`;
  } else {
    // comment url.
  }

  if (status === "no vote") {
    data = {upvote: true}
  }
  else {
    data = (status === "downvoted") ? {downvote: false, upvote: true} : {upvote: false};
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
    return false;
  }
  return true;
}

export async function postDownvoteToPost(postId, currentNumUpvotes, currentNumDownvotes, status, thingToDownvote) {
  let data;
  let apiUrl;

  if (thingToDownvote === "post") {
    apiUrl = `http://localhost:8000/api/post/id=${postId}/`;
  } else {
    // comment url
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

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
      return false;
  }
  return true;
}

export async function postUsersDownvote(userId, postId, thingToDownvote) {
  let data;
  let apiUrl;

  if (thingToDownvote === "post") {
    apiUrl = "http://localhost:8000/api/post-votes/"
    data = {
      id: uuid_v4(),
      upvote: false,
      downvote: true,
      user: userId,
      post: postId
    }
  } else {
    // comment url
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    return false;
  }
  return {result: true, data: data};
}

export async function patchUsersDownvote(status, postVoteId, thingToDownvote) {
  let data;
  let apiUrl;

  if (thingToDownvote === "post") {
    apiUrl = `http://localhost:8000/api/post-vote/${postVoteId}/`
  } else {
    // comment url
  }

  if (status === "no vote") {
    data = {downvote: true}
  }
  else {
    data = (status === "downvoted") ? {downvote: false} : {downvote: true, upvote: false};
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
    return false;
  }
  return true;
}
