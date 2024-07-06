import { derived, writable } from "svelte/store";
import type { Image } from "../types";

export type DataStore = { count: number, images: Image[] }

export const dataStore = writable<DataStore>()

export const transformedDataStore = derived(dataStore, $dataStore => {
	const transformed: [Image[], Image[], Image[]] = [[], [], []]

	$dataStore.images.forEach((img, i) => {
		if(i % 3 == 0) {
			transformed[0].push(img)
		} else if(i % 3 == 1) {
			transformed[1].push(img)
		} else {
			transformed[2].push(img)
		}
	})

	return transformed
})

