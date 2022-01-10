import { useEffect } from "react";

const DateOfPost = (props) => {

    function timeElapsedFromPost() {
        const dateToday = new Date();
        let timeElapsed;

        // yyyy/mm/dd/hours/minutes format of today and time of post respectively.
        const [yearToday, monthToday, dayToday] = [dateToday.getFullYear(), dateToday.getMonth() + 1, dateToday.getDate()];
        const [hoursToday, minutesToday] = [dateToday.getHours() + 1, dateToday.getMinutes()];

        const dateOfPost = props.dateCreated.split("-");
        const [yearOfPost, monthOfPost, dayOfPost] = 
        [parseInt(dateOfPost[0]), parseInt(dateOfPost[1]), parseInt(dateOfPost[2].substring(0, 2))];
        const [hoursOfPost, minutesOfPost] = [parseInt(dateOfPost[2].substring(3, 5)), parseInt(dateOfPost[2].substring(6, 8))];
    }

    useEffect(() => {
        timeElapsedFromPost();
    })

    return (
        <span className="post-date">
            {props.dateCreated}
        </span>
    )
}

export default DateOfPost

