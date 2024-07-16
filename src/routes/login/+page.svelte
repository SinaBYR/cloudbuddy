<svelte:head>
	<title>Login</title>
</svelte:head>

<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Button, ButtonGroup, Input, InputAddon, Label } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { type AuthStore, authStore } from "../../stores/authStore";
	import { isLoggedIn } from "$lib/auth";
	import { goto } from "$app/navigation";

	let username = '', passphrase = '', error = ''
	$: valid = username.length !== 0 && passphrase.length >= 8

	onMount(() => {
		if(isLoggedIn()) goto('/')
	})

	async function handleLogin() {
		error = ''
		const res = await fetch("http://localhost:8080/v1/auth/signin", {
			method: 'POST',
			body: JSON.stringify({ username, passphrase }),
		})
		if(!res.ok) {
			error = "Our gatekeeper clouds don't recognize you :("
			return
		}
		const { token, ...user }: AuthStore = await res.json()
		localStorage.setItem('user', JSON.stringify(user))
		localStorage.setItem('token', token)
		authStore.set({token, ...user})
		goto('/manage')
	}
</script>

<form
	in:fade
	class="max-w-xl mx-auto mt-16"
	on:submit|preventDefault={handleLogin}
>
	{#if error}
		<div class="mb-6">
			<p>{error}</p>
		</div>
	{/if}
	<div class="mb-6">
		<Label for="username" class="block mb-2">Username</Label>
		<ButtonGroup class="w-full">
			<InputAddon>
				<Icon icon="mdi:user" class="w-5 h-5" />
			</InputAddon>
			<Input
				id="username"
				type="text"
				bind:value={username}
			/>
		</ButtonGroup>
	</div>

	<div class="mb-6">
		<Label for="passphrase" class="block mb-2">Passphrase</Label>
		<ButtonGroup class="w-full">
			<InputAddon>
				<Icon icon="mdi:key" class="w-5 h-5" />
			</InputAddon>
			<Input
				id="passphrase"
				type="password"
				bind:value={passphrase}
			/>
		</ButtonGroup>
	</div>

	<div>
		<Button
			type="submit"
			color="alternative"
			class="w-full text-light-secondary dark:text-dark-secondary"
			disabled={!valid}
		>Login</Button>
	</div>
</form>

