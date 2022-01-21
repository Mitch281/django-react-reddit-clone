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

// TODO: handle case where created time bigger than time now. For example, post may have been created on 8th month, month now might be
// 2nd month. Thus, we can't do month now - month then.
export function getTimeElapsedFromPost(pythonDateTimeObject) {
    let timeElapsed;

    const {dayCreated, monthCreated, yearCreated} = getDayMonthYearOfPost(pythonDateTimeObject);
    const {hourCreated, minuteCreated, secondCreated} = getTimeOfPost(pythonDateTimeObject);
    
    const {dayNow, monthNow, yearNow} = getDateNow();
    const {hourNow, minuteNow, secondNow} = getTimeNow();

    // Post was created in different years.
    if (yearCreated !== yearNow) {
        let monthsElapsed = (12 - monthCreated) + monthNow;

        // Post was created more than 12 months ago. Thus, we use years.
        if (monthsElapsed > 12) {
            timeElapsed = yearNow - yearCreated;
            if (timeElapsed === 1) {
                return `${timeElapsed} year ago`;
            } else {
                return `${timeElapsed} years ago`;
            }
        
        // Post was created less than 12 months ago. Thus, we use months.
        } else {
            timeElapsed = monthsElapsed;
            if (timeElapsed === 1) {
                return `${timeElapsed} month ago`;
            } else {
                return `${timeElapsed} months ago`;
            }
        }
    }

    else if (monthCreated !== monthNow) {
        // TODO: ADJUST FOR MOTNHS WITHOUT 31 DAYS.
        let daysElapsed = (31 - dayCreated) + dayNow;

        // Posts were created in different months, and it's been more than 31 days. Thus, we use months.
        if (daysElapsed > 31) {
            timeElapsed = monthNow - monthCreated;
            if (timeElapsed === 1) {
                return `${timeElapsed} month ago`;
            } else {
                return `${timeElapsed} months ago`;
            }
        }
        
        // Post was created in different months but less than or equal than 31 days apart. Thus, we use days.
        else {
            timeElapsed = daysElapsed;
            if (timeElapsed === 1) {
                return `${timeElapsed} day ago`;
            } else {
                return `${timeElapsed} days ago`;
            }
        }
    }

    // Post was created in different days.
    else if (dayCreated !== dayNow) {
        let hoursElapsed = (23 - hourCreated) + hourNow;

        // Post was created in different days and it's been more than 24 hours. Thus, we use days.
        if (hoursElapsed > 24) {
            timeElapsed = dayNow - dayCreated;
            if (timeElapsed === 1) {
                return `${timeElapsed} day ago`;
            } else {
                return `${timeElapsed} days ago`;
            }
        }

        // Post was created in different days but it's been less than 24 hours. Thus, we use hours.
        else {
            timeElapsed = hoursElapsed;
            if (timeElapsed === 1) {
                return `${timeElapsed} hour ago`;
            } else {
                return `${timeElapsed} hours ago`;
            }
        }
    }

    else if (hourCreated !== hourNow) {
        let minutesElapsed = (60 - minuteCreated) + minuteNow;

        // Post was created in different hours and it's been more than 60 minutes. Thus, we use hours.
        if (minutesElapsed > 60) {
            timeElapsed = hourNow - hourCreated;
            if (timeElapsed === 1) {
                return `${timeElapsed} hour ago`;
            } else {
                return `${timeElapsed} hours ago`;
            }
        }

        // Post was created i different hours but it's been less than 60 minutes. Thus, we use minutes.
        else {
            timeElapsed = minutesElapsed;
            if (timeElapsed === 1) {
                return `${timeElapsed} minute ago`;
            } else {
                return `${timeElapsed} minutes ago`;
            }
        }
    }


    else if (minuteCreated !== minuteNow) {
        let secondsElapsed = (60 - secondCreated) + secondNow;

        // Post was created in different minutes and it's been more than 60 seconds. Thus, we use minutes.
        if (secondsElapsed > 60) {
            timeElapsed = minuteNow - minuteCreated;
            if (timeElapsed === 1) {
                return `${timeElapsed} minute ago`;
            } else {
                return `${timeElapsed} minutes ago`;
            }
        }

        // Post was created in different minutes but it's been less than 60 seconds. Thus, we use seconds.
        else {
            timeElapsed = secondsElapsed;
            if (timeElapsed === 1) {
                return `${timeElapsed} seconds ago`;
            } else {
                return `${timeElapsed} seconds ago`;
            }
        }
    }
    else {
        timeElapsed = secondNow - secondCreated;
        if (timeElapsed === 1) {
            return `${timeElapsed} seconds ago`;
        } else {
            return `${timeElapsed} seconds ago`;
        }
    }
}