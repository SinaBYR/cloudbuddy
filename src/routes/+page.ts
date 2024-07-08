import { dataStore, type DataStore } from "../stores/dataStore";

export const ssr = false;

export const load = async () => {
	try {
		const res = await fetch('http://localhost:8080/v1/images');
		const data: DataStore = await res.json()
		const stringImages = localStorage.getItem('likedImages')

		dataStore.set({
			...data,
			images: data.images.map(i => {
				let liked = false

				if(stringImages) {
					const likedImages: string[] = JSON.parse(stringImages)
					liked = likedImages.includes(i.uuid) ? true : false
				}

				return {
					...i,
					liked,
				}
			}),
		})
	} catch(err) {
		console.error(err)
		return {
			err
		}
	}
}

