<script lang="ts">
	import "../app.css";
	import Icon from '@iconify/svelte';
	import { onMount } from "svelte";
	import { authStore, type AuthStore } from "../stores/authStore";
	import { getLocalAuth } from "$lib/auth";

	let auth: AuthStore|undefined
	let darkMode = (localStorage.getItem('darkMode') === 'true' ? true : false) || false
	if(darkMode) {
		document.documentElement.classList.add('dark')
	}

	onMount(() => {
		const auth = getLocalAuth()
		if(auth) authStore.set(auth)
	})

	onMount(() => {
		const unsubscribe = authStore.subscribe(as => {
			auth = as
		})

		return unsubscribe;
	})

</script>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

  :global(body) {
		@apply bg-light-primary;
		@apply text-light-secondary;
		@apply dark:bg-dark-primary;
		@apply dark:text-dark-secondary;
		font-family: "Noto Sans", sans-serif;
		padding: 0 1rem;
  }
</style>

<nav class="flex items-center justify-between max-w-4xl mx-auto py-4">
	<div>
		<a href="/">
			<h1 class="text-xl font-bold">CloudBuddy</h1>
		</a>
	</div>
	<div class="flex items-center justify-center">
		<button
			class="group mr-4"
			on:click={() => {
				if(darkMode) {
					document.documentElement.classList.remove('dark')
					darkMode = false
					localStorage.setItem('darkMode', 'false')
				} else {
					document.documentElement.classList.add('dark')
					darkMode = true
					localStorage.setItem('darkMode', 'true')
				}
			}}
		>
			{#if !darkMode}
				<Icon icon="ion:moon-sharp" class="text-2xl group-hover:opacity-80" />
			{:else}
				<Icon icon="ion:sunny" class="text-2xl group-hover:opacity-80" />
			{/if}
		</button>
		{#if auth}
			<a href="/dashboard" class="group">
				<Icon icon="bi:clouds-fill" class="text-2xl group-hover:opacity-80" />
			</a>
		{:else}
			<a href="/login" class="group">
				<Icon icon="mdi:user" class="text-3xl group-hover:opacity-80" />
			</a>
		{/if}
	</div>
</nav>

<div class="max-w-4xl mx-auto py-4 mb-20">
	<slot />
</div>

<footer
	class="fixed bottom-0 left-0 w-full flex justify-center items-center p-4 bg-light-primary dark:bg-dark-primary"
	style="box-shadow: 0 -1px 32px 12px {darkMode ? '#222831' : '#E1F7F5'};"
>
	<a href="https://github.com/sinabyr/cloudbuddy">
		<Icon icon="mdi:github" class="text-xl inline mb-1" />
	</a>
	<span class="mb-1 select-none">&nbsp;|&nbsp;</span>
	<p>
		<span>Made with lots of&nbsp;</span>
		<span><Icon icon="bi:clouds-fill" class="text-xl inline mb-1" /></span>
	</p>
</footer>

