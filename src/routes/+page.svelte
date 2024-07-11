<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Gallery, Modal } from 'flowbite-svelte';
	import type { Image } from '../types';
	import { dataStore, transformedDataStore, type DataStore } from '../stores/dataStore';
	import { onMount } from 'svelte';
	import { Image as OptimizedImage } from '@unpic/svelte';
	import { fade } from 'svelte/transition';

	let dbImagesCount = 0
	let imagesCount = 0
	let imageInModal: Image|null = null
	let modal = false
	let imagesArrays: [Image[], Image[], Image[]] = [[],[],[]]

	onMount(() => {
		const unsubscribe = dataStore.subscribe(value => {
			imagesCount = value.images.length
			dbImagesCount = value.count
		})

		return unsubscribe;
	})

	onMount(() => {
		const unsubscribe = transformedDataStore.subscribe(value => {
			imagesArrays = value
		})

		return unsubscribe
	})

	function onImageView(image: Image) {
		modal = true
		imageInModal = image
	}

	async function onLoadMore() {
		try {
			const res = await fetch('http://localhost:8080/v1/images' + '?offset=' + imagesCount);
			const data: DataStore = await res.json();
			imagesCount = imagesCount + 5;
			const stringImages = localStorage.getItem('likedImages')

			dataStore.update(ds => ({
				...ds,
				images: ds.images.concat(data.images.map(i => {
					let liked = false

					if(stringImages) {
						const likedImages: string[] = JSON.parse(stringImages)
						liked = likedImages.includes(i.uuid) ? true : false
					}

					return {
						...i,
						liked,
					}
				})),
			}))
		} catch(err) {
			console.error(err)
		}
	}

	async function onImageLike(image: Image) {
		try {
			const res = await fetch("http://localhost:8080/v1/images/" + image.uuid + "/like", {
				method: 'PUT',
			})
			if(res.status === 204) {
				dataStore.update(ds => ({
					...ds,
					images: ds.images.map(i => i.uuid === image.uuid
						? ({ ...i, likes: i.likes + 1, liked: true })
						: i
					)
				}))

				const stringImages = localStorage.getItem('likedImages')
				if(!stringImages) {
					const likedImages = []
					likedImages.push(image.uuid)
					const stringifiedImages = JSON.stringify(likedImages)
					localStorage.setItem('likedImages', stringifiedImages)
				} else {
					const likedImages: string[] = JSON.parse(stringImages)
					likedImages.push(image.uuid)
					const stringifiedImages = JSON.stringify(likedImages)
					localStorage.setItem('likedImages', stringifiedImages)
				}
			}
		} catch(err) {
			console.error(err)
		}
	}

	async function onImageDislike(image: Image) {
		try {
			const res = await fetch("http://localhost:8080/v1/images/" + image.uuid + "/dislike", {
				method: 'PUT',
			})
			if(res.status === 204) {
				dataStore.update(ds => ({
					...ds,
					images: ds.images.map(i => i.uuid === image.uuid
						? ({ ...i, likes: i.likes - 1, liked: false })
						: i
					)
				}))
				const stringImages = localStorage.getItem('likedImages')
				if(!stringImages) return

				const likedImages: string[] = JSON.parse(stringImages)
				const newLikedImages = likedImages.filter(uuid => uuid !== image.uuid)
				const stringifiedImages = JSON.stringify(newLikedImages)
				localStorage.setItem('likedImages', stringifiedImages)
			}
		} catch(err) {
			console.error(err)
		}
	}
</script>

{#if imageInModal}
	<Modal
		title="Cloud"
		bind:open={modal}
		classHeader="text-light-secondary dark:text-dark-secondary"
		classFooter="text-light-secondary dark:text-dark-secondary"
		autoclose
		outsideclose
	>
		<img
			src={imageInModal.image_url}
			alt={imageInModal.image_url}
			class="group-hover:opacity-50 w-full h-auto"
		/>
		<svelte:fragment slot="footer">
			<a
				href={imageInModal.image_url}
				class="flex justify-center items-center mr-auto"
				title="Download"
			>
				<span class="mr-2">Download</span>
				<Icon icon="mdi:download" class="text-2xl w-7 h-7" />
			</a>
			<div>
				{#if imageInModal.liked}
					<button
						title="Remove like"
						class="flex flex-col items-center"
						on:click|stopPropagation={async () => {
							if(!imageInModal) return

							try {
								await onImageDislike(imageInModal)
								imageInModal.likes -= 1
								imageInModal.liked = false
							} catch(err) {
								console.error(err)
							}
						}}
					>
						<Icon icon="mdi:cloud" class="text-2xl w-7 h-7" />
						<span class="text-md">{imageInModal.likes}</span>
					</button>
				{:else}
					<button
						title="Like"
						class="flex flex-col items-center"
						on:click|stopPropagation={async () => {
							if(!imageInModal) return

							try {
								await onImageLike(imageInModal)
								imageInModal.likes += 1
								imageInModal.liked = true
							} catch(err) {
								console.error(err)
							}
						}}
					>
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md">{imageInModal.likes}</span>
					</button>
				{/if}
			</div>
		</svelte:fragment>
	</Modal>
{/if}

<Gallery class="gap-4 grid-cols-2 md:grid-cols-3">
	{#each imagesArrays as images}
		<Gallery class="h-fit">
			{#each images as image}
				<button
					in:fade
					class="relative block group cursor-pointer"
					title="View the cloud"
					on:click={() => onImageView(image)}
				>
					<OptimizedImage
						src={image.image_url}
						alt={image.image_url}
						class="group-hover:opacity-50 h-full object-center object-cover"
						layout="fullWidth"
						loading="lazy"
					/>
					<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
						{#if image.liked}
							<button
								title="Remove like"
								class="flex flex-col items-center"
								on:click|stopPropagation={() => onImageDislike(image)}
							>
								<Icon icon="mdi:cloud" class="text-2xl text-blue-300 w-7 h-7" />
								<span class="text-md text-blue-300">{image.likes}</span>
							</button>
						{:else}
							<button
								title="Like"
								class="flex flex-col items-center"
								on:click|stopPropagation={() => onImageLike(image)}
							>
								<Icon icon="mdi:cloud-outline" class="text-2xl text-blue-300 w-7 h-7" />
								<span class="text-md text-blue-300">{image.likes}</span>
							</button>
						{/if}
					</div>
				</button>
			{/each}
		</Gallery>
	{/each}
</Gallery>

{#if imagesCount < dbImagesCount}
	<div class="w-full flex justify-center items-center mt-4 border border-light-secondary dark:border-dark-secondary">
		<button class="w-full h-full p-4" on:click={() => onLoadMore()}>
			<span>Load more cloud</span>
		</button>
	</div>
{/if}

