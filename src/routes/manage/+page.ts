import type { DataStore } from "../../stores/dataStore";
import { manageStore } from "../../stores/manageStore";

export const ssr = false
export const csr = true

export const load = async () => {
	try {
		const res = await fetch('http://localhost:8080/v1/images')
		const data: DataStore = await res.json()

		manageStore.set(data)
	} catch(err) {
		console.error(err)
		return {
			err
		}
	}
}

