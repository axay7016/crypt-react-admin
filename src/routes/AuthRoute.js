import React from 'react'
import { Navigate } from 'react-router-dom'
import { getTokenFromLocalSorage } from 'src/utils/localStorage'
import Login from 'src/views/pages/login/Login'

function AuthRoute() {
    const user_type = JSON.parse(localStorage.getItem("user_type"));
    const token = getTokenFromLocalSorage()
    if (user_type && user_type == "team_member") {
        return <Navigate to="/nothing" replace />
    } else if ((!user_type) && token) {
        return <Navigate to="/dashboard" replace />
    } else {
        return <Login />
    }
}
export default AuthRoute

