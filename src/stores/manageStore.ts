import { writable } from "svelte/store";
import type { DataStore } from "./dataStore";

export const manageStore = writable<DataStore>({ images: [], count: 0 })

