import React from 'react'

const User = (props) => {
    return (
        <span className="username">
            Posted by {props.username}
        </span>
    )
}

export default User
