// NOTE: TIMES ARE AEST

// Gets month, day and year in nice format.
function getDayMonthYearOfPost(pythonDateTimeObject) {
    const date = pythonDateTimeObject.substring(0, 10);
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];

    return {dayCreated: parseInt(day), monthCreated: parseInt(month), yearCreated: parseInt(year)}
}

function getTimeOfPost(pythonDateTimeObject) {
    const time = pythonDateTimeObject.substring(11, 19);
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const second = time.split(":")[2];

    return {hourCreated: parseInt(hour), minuteCreated: parseInt(minute), secondCreated: parseInt(second)}
}

function getDateNow() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {dayNow: parseInt(day), monthNow: parseInt(month), yearNow: parseInt(year)}
}

function getTimeNow() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return {hourNow: parseInt(hour), minuteNow: parseInt(minute), secondNow: parseInt(second)}
}

export function getTimeElapsedFromPost(pythonDateTimeObject) {
    const dateCreated = Date.parse(pythonDateTimeObject);
    const dateToday = new Date();

    const secondsElapsed = ((dateToday.getTime() - dateCreated) / 1000);
    const minutesElapsed = Math.round(secondsElapsed / 60);
    const hoursElapsed = Math.round(secondsElapsed / (60 * 60));
    const daysElapsed = Math.round(secondsElapsed / ( 60 * 60 * 24));
    const monthsElapsed = Math.round(secondsElapsed / (60 * 60 * 24 * 31));
    const yearsElapsed = Math.round(secondsElapsed / (60 * 60 * 24 * 31 * 12));

    if (secondsElapsed < 60) {
        if (secondsElapsed === 1) {
            return `${secondsElapsed} second ago`;
        } else {
            return `${secondsElapsed} seconds ago`;
        }
    }
    else if (minutesElapsed < 60) {
        if (minutesElapsed === 1) {
            return `${minutesElapsed} minute ago`;
        } else {
            return `${minutesElapsed} minutes ago`;
        }
    }
    else if (hoursElapsed < 24) {
        if (hoursElapsed === 1) {
            return `${hoursElapsed} hour ago`;
        } else {
            return `${hoursElapsed} hours ago`;
        }
    } 
    else if (daysElapsed < 31) {
        if (daysElapsed === 1) {
            return `${daysElapsed} day ago`;
        } else {
            return `${daysElapsed} days ago`;
        }
    }
    else if (monthsElapsed < 12) {
        if (monthsElapsed === 1) {
            return `${monthsElapsed} month ago`;
        } else {
            return `${monthsElapsed} months ago`;
        }
    }
    else {
        if (yearsElapsed === 1) {
            return `${yearsElapsed} year ago`;
        } else {
            return `${yearsElapsed} years ago`;
        }
    }
}