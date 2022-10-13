import React from 'react'

const Success = ({ successMessage }) => {

    return (
        <div className="alert alert-success" role="alert">
            <strong className="mx-2">Success</strong> {successMessage}
        </div>
    )
}

export default Success