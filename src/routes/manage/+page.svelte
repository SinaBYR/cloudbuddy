<script lang="ts">
	import { goto } from "$app/navigation";
	import { isLoggedIn } from "$lib/auth";
	import { Button, Fileupload, Input } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { fade } from "svelte/transition";
	import { authStore } from "../../stores/authStore";
	import { manageStore } from "../../stores/manageStore";
	import type { Image } from "../../types";

	let title = '', files: FileList|undefined, images: Image[] = []
	$: valid = title.length !== 0 && (files?.length || 0) > 0

	onMount(() => {
		if(!isLoggedIn()) goto('/')
	})

	onMount(() => {
		const unsubscribe = manageStore.subscribe(value => {
			images = value.images
			// imagesCount = value.count
		})

		return unsubscribe;
	})

	async function handleUpload() {
		const file = files?.item(0)
		if(!file || !title) return
		const formData = new FormData()
		formData.append('title', title)
		formData.append('image', file)
		const token = get(authStore)?.token
		if(!token) return
		try {
			const res = await fetch('http://localhost:8080/v1/images', {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			})
			const newImage: Image = await res.json()
			manageStore.update(ds => ({
				...ds,
				images: ds.images.concat({
					...newImage,
					liked: false,
				}),
			}))
			console.log(newImage)
		} catch(err) {
			console.error(err)
		}
	}
</script>

<div class="w-full">
	<form
		in:fade
		class="mt-4"
		on:submit|preventDefault={handleUpload}
	>
		<div class="flex flex-col md:flex-row gap-4 items-center">
			<div class="w-full">
				<Input
					id="title"
					type="text"
					placeholder="Title"
					bind:value={title}
				/>
			</div>
			<div class="w-full">
				<Fileupload
					id="image"
					bind:files={files}
					accept="image/png, image/jpeg"
				/>
			</div>
			<div class="ml-auto w-full md:w-auto">
				<Button
					disabled={!valid}
					type="submit"
					color="alternative"
					class="w-full text-light-secondary dark:text-dark-secondary"
				>Upload</Button>
			</div>
		</div>
	</form>
</div>

{#each images as img}
	<div class="flex items-center justify-between">
		<div>
			<h1>{img.title}</h1>
			<h2>{img.likes}</h2>
		</div>
		<div>
			<Button color="alternative">Edit</Button>
		</div>
	</div>
{/each}

