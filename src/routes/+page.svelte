<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Gallery, Modal } from 'flowbite-svelte';
	import type { Image } from '../types';
	import { dataStore, transformedDataStore, type DataStore } from '../stores/dataStore';
	import { onMount } from 'svelte';

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

		return unsubscribe;
	})

	function onImageClick(image: Image) {
		modal = true
		imageInModal = image
	}

	async function onLoadMore() {
		try {
			const res = await fetch('http://localhost:8080/v1/images' + '?offset=' + imagesCount);
			const data: DataStore = await res.json();
			imagesCount = imagesCount + 5;
			dataStore.update($ds => ({...$ds, images: $ds.images.concat(data.images)}))
		} catch(err) {
			console.error(err)
		}
	}
</script>

{#if imageInModal != null}
	<Modal
		title="Cloud"
		bind:open={modal}
		class="bg-slate-100"
		classHeader="bg-slate-100"
		classFooter="bg-slate-100"
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
			<button title="Like" class="flex justify-center items-center">
				<span class="text-md mr-4">{imageInModal.likes}</span>
				<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
			</button>
		</svelte:fragment>
	</Modal>
{/if}

<Gallery class="gap-4 grid-cols-2 md:grid-cols-3">
	<Gallery>
		{#each imagesArrays[0] as image}
			<button class="relative block group cursor-pointer" title="view the cloud" on:click={() => onImageClick(image)}>
				<img src={image.image_url} alt={image.image_url} class="group-hover:opacity-50 h-full object-center object-cover" />
				<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
					<button title="cloud the cloud" on:click|stopPropagation>
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md text-white">{image.likes}</span>
					</button>
				</div>
			</button>
		{/each}
	</Gallery>

	<Gallery>
		{#each imagesArrays[1] as image}
			<button class="relative group cursor-pointer" title="view the cloud" on:click={() => onImageClick(image)}>
				<img src={image.image_url} alt={image.image_url} class="group-hover:opacity-50 h-full object-center object-cover" />
				<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
					<button title="cloud the cloud" on:click|stopPropagation>
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md text-white">{image.likes}</span>
					</button>
				</div>
			</button>
		{/each}
	</Gallery>

	<Gallery>
		{#each imagesArrays[2] as image}
			<button class="relative group cursor-pointer" title="view the cloud" on:click={() => onImageClick(image)}>
				<img src={image.image_url} alt={image.image_url} class="group-hover:opacity-50 h-full object-center object-cover" />
				<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
					<button title="cloud the cloud" on:click|stopPropagation>
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md text-white">{image.likes}</span>
					</button>
				</div>
			</button>
		{/each}
	</Gallery>
</Gallery>

{#if imagesCount < dbImagesCount}
	<div class="w-full flex justify-center items-center mt-4 border border-slate-500">
		<button class="w-full h-full p-4" on:click={() => onLoadMore()}>
			<span>Load more cloud</span>
		</button>
	</div>
{/if}

