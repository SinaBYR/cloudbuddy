import type { Image } from "../types";

export const ssr = false;

export const load = async () => {
	try {
		const res = await fetch('http://localhost:8080/v1/images');
		const data: Image[] = await res.json()
		return {
			images: data
		}
	} catch(err) {
		return {
			images: []
		}
	}
}

