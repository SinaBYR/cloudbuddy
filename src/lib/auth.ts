import type { User } from "../types"
import { parseJwtPayload } from "./jwt"
import type { AuthStore } from "../stores/authStore"

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

