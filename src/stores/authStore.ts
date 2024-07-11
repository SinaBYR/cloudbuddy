import { writable } from "svelte/store";
import type { User } from "../types";

export type AuthStore = {
	token: string
} & User

export const authStore = writable<AuthStore|undefined>(undefined)

