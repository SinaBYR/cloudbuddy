<script lang="ts">
	import { Button, Fileupload, Input } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { fade } from "svelte/transition";
	import { authStore } from "../../stores/authStore";
	import { manageStore } from "../../stores/manageStore";
	import { type DataStore } from "../../stores/dataStore";
	import type { Image } from "../../types";
	import Icon from '@iconify/svelte';
	import { isLoggedIn } from "$lib/auth";
	import { goto } from "$app/navigation";

	if(!isLoggedIn()) goto('/')

	let images: Image[] = []
	let imageCount = 0, dbImageCount = 0
	let title = '', files: FileList|undefined, error = ''
	$: valid = (files?.length || 0) > 0

	onMount(() => {
		const unsubscribe = manageStore.subscribe(value => {
			images = value.images
			imageCount = value.images.length
			dbImageCount = value.count
		})

		return unsubscribe
	})


	async function handleDeleteImage(image: Image) {
		error = ''
		try {
			const token = get(authStore)?.token
			if(!token) return
			const res = await fetch("http://localhost:8080/v1/images/" + image.uuid, {
				method: 'DELETE',
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			})
			if(res.status === 204) {
				manageStore.update(ds => ({
					...ds,
					images: ds.images.filter(i => i.uuid !== image.uuid)
				}))
				return
			}

			const errMessage = await res.json()
			error = errMessage.messsage
		} catch(err) {
			error = 'something went wrong please excuse my garbage code'
			console.error(err)
		}
	}

	async function handleChangeTitle(image: Image) {
		try {
			const formData = new FormData()
			formData.set('title', image.title)
			const token = get(authStore)?.token
			if(!token) return
			const res = await fetch("http://localhost:8080/v1/images/" + image.uuid + "/changeTitle", {
				method: 'PUT',
				body: formData,
				headers: {
					'Authorization': 'Bearer ' + token,
				},
			})
			if(res.status === 204) {
				manageStore.update(ds => ({
					...ds,
					images: ds.images.map(i => i.uuid !== image.uuid ? i : ({ ...i, title: image.title }))
				}))
				return
			}

			const errMessage = await res.json()
			error = errMessage.messsage
		} catch(err) {
			error = 'something went wrong please excuse my garbage code'
			console.error(err)
		}
	}

	async function handleLoadMore() {
		const params = new URLSearchParams()
		const user = get(authStore)
		if(!user) return
		params.set('userId', user.uuid)
		params.set('offset', imageCount.toFixed())
		try {
			const res = await fetch('http://localhost:8080/v1/images?' + params.toString())
			if(res.status === 200) {
				const data: DataStore = await res.json()
				imageCount += 5

				manageStore.update(ms => ({
					...ms,
					images: ms.images.concat(data.images),
				}))
				return
			}

			const errMessage = await res.json()
			error = errMessage.messsage
		} catch(err) {
			error = 'something went wrong please excuse my garbage code'
			console.error(err)
		}
	}

	async function handleUpload() {
		error = ''
		const file = files?.item(0)
		if(!file) return
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
			if(res.status === 201) {
				const newImage: Image = await res.json()
				manageStore.update(ds => ({
					...ds,
					images: ds.images.concat({
						...newImage,
						liked: false,
					}),
				}))
				dbImageCount += 1
				imageCount += 1
				console.log(newImage)
				return
			}

			const errMessage = await res.json()
			error = errMessage.messsage
		} catch(err) {
			error = 'something went wrong please excuse my garbage code'
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
		{#if error}
			<div class="mb-6 text-center">
				<p>{error}</p>
			</div>
		{/if}

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
	<div class="flex items-center justify-between p-2 mt-8 shadow-md rounded">
		<div>
			<input
				id="title"
				type="text"
				class="w-full bg-transparent border-none"
				placeholder="Title"
				bind:value={img.title}
				on:blur={() => handleChangeTitle(img)}
			/>
		</div>
		<div>
			<button
				class="border-none p-2"
				on:click={() => handleDeleteImage(img)}
			>
				<Icon icon="mdi:delete" class="text-xl" />
			</button>
		</div>
	</div>
{/each}

{#if imageCount < dbImageCount}
	<div class="w-full flex justify-center items-center mt-4">
		<button class="w-full h-full p-4" on:click={() => handleLoadMore()}>
			<span>Load more</span>
		</button>
	</div>
{/if}

