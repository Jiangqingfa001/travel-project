const TOKEN_KEY = 'travel_token'
const USER_KEY = 'travel_user'
const USERS_KEY = 'travel_users'

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export function getUser() {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUser() {
    localStorage.removeItem(USER_KEY)
}

export function isLoggedIn() {
    return !!getToken()
}

export function logout() {
    removeToken()
    removeUser()
}

export function getMockUsers() {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
}

export function saveMockUser(user) {
    const users = getMockUsers()
    const exist = users.findIndex(u => u.phone === user.phone)
    if (exist >= 0) {
        users[exist] = user
    } else {
        users.push(user)
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findMockUserByPhone(phone) {
    const users = getMockUsers()
    return users.find(u => u.phone === phone) || null
}