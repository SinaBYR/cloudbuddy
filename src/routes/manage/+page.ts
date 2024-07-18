import { manageStore } from "../../stores/manageStore"
import type { DataStore } from "../../stores/dataStore"
import { getLocalAuth } from "$lib/auth"

export const ssr = false
export const csr = true

export const load = async () => {
	const user = getLocalAuth()
	if(!user) return
	const params = new URLSearchParams()
	params.set('userId', user.uuid)
	try {
		const res = await fetch('http://localhost:8080/v1/images?' + params.toString())
		const data: DataStore = await res.json()

		manageStore.set(data)
	} catch(err) {
		console.error(err)
		return {
			err
		}
	}
}

