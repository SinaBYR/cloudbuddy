import { dataStore, type DataStore } from "../stores/dataStore";

export const ssr = false;

export const load = async () => {
	try {
		const res = await fetch('http://localhost:8080/v1/images');
		const data: DataStore = await res.json()
		dataStore.set({
			...data,
			images: data.images.map(i => ({...i, liked: false})),
		})
	} catch(err) {
		console.error(err)
		return {
			err
		}
	}
}

