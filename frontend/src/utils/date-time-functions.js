export function getTimeElapsedFromCreation(pythonDateTimeObject) {
    const dateCreated = Date.parse(pythonDateTimeObject);
    const dateToday = new Date();

    const secondsElapsed = 0 || Math.round(((dateToday.getTime() - dateCreated) / 1000));
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