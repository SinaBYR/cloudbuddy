import type { User } from "../types"
import { parseJwtPayload } from "./jwt"
import { authStore, type AuthStore } from "../stores/authStore"

export function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('user')
	authStore.update(() => undefined)
}

export function isLoggedIn() {
	return getLocalAuth() !== null
}

export function getLocalAuth(): AuthStore | null {
	const token = localStorage.getItem('token')
	const user = localStorage.getItem('user')
	if(!token || !user) return null
	const expired = new Date().getTime() > parseJwtPayload(token).exp
	if(expired) return null
	const parsedUser: User = JSON.parse(user)
	return {
		...parsedUser,
		token,
	}
}

