import React from 'react'

const Error = ({ errorMessage }) => {
    return (
        <div className="alert alert-danger" role="alert">
            <strong className="mx-2">Error</strong> {errorMessage}
        </div>
    )
}

export default Error