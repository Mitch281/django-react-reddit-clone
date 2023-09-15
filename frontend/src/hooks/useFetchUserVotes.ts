import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserContext } from "../app/App";
import { AppDispatch, RootState } from "../app/store";
import { fetchUsersVotesOnComments } from "../features/users/usersVotesOnCommentsSlice";
import { fetchUsersVotesOnPosts } from "../features/users/usersVotesOnPostsSlice";
import { VoteObjects } from "../utils/constants";

function useFetchUserVotes(voteObject: "comment" | "post") {
    const dispatch = useDispatch<AppDispatch>();
    const usersVotesOnObjectStatus = useSelector((state: RootState) => {
        if (voteObject === VoteObjects.Post) {
            return state.usersVotesOnPosts.status;
        }
        return state.usersVotesOnComments.status;
    });
    const { userIdLoggedIn } = useContext(UserContext);

    useEffect(() => {
        if (userIdLoggedIn) {
            if (voteObject === VoteObjects.Post) {
                dispatch(fetchUsersVotesOnPosts(userIdLoggedIn));
            } else {
                dispatch(fetchUsersVotesOnComments(userIdLoggedIn));
            }
        }
        // eslint-disable-next-line
    }, [dispatch, userIdLoggedIn]);

    if (usersVotesOnObjectStatus === "rejected") {
        let errorMessage;
        if (voteObject === VoteObjects.Post) {
            errorMessage = "Could not fetch your votes on posts!";
        } else {
            errorMessage = "Could not fetch your votes on comments!";
        }
        toast.error(errorMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}

export default useFetchUserVotes;
