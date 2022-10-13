export const setTokenInLocalSorage = (data) => {
    localStorage.setItem('tokenAdmin', JSON.stringify(data))
}
export const getTokenFromLocalSorage = () => {
    const token = JSON.parse(localStorage.getItem('tokenAdmin'))
    return token
}

export const removeTokenInLocalSorage = () => {
    localStorage.clear();
}

export const setRoleInLocalSorage = (role, type) => {
    localStorage.setItem('role', JSON.stringify(role))
    localStorage.setItem('user_type', JSON.stringify(type))
}

export const getRoleLocalSorage = () => {
    const role = JSON.parse(localStorage.getItem('role'))
    return role
}