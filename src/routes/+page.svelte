<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Gallery } from 'flowbite-svelte';
	import type { Image } from '../types';

	export let data: { images: Image[] };
	let imageArrays: [Image[], Image[], Image[]] = [[],[],[]];
	data.images.forEach((img, i) => {
		if(i % 3 == 0) {
			imageArrays[0].push(img)
		} else if(i % 3 == 1) {
			imageArrays[1].push(img)
		} else {
			imageArrays[2].push(img)
		}
	})

</script>

<Gallery class="gap-4 grid-cols-2 md:grid-cols-3">
	<Gallery>
		{#each imageArrays[0] as image}
			<div class="relative group cursor-pointer" title="view the cloud">
				<img src={image.image_url} alt={image.image_url} class="group-hover:opacity-50 h-full object-center object-cover" />
				<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
					<button title="cloud the cloud">
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md text-white">{image.likes}</span>
					</button>
				</div>
			</div>
		{/each}
	</Gallery>

	<Gallery>
		{#each imageArrays[1] as image}
			<div class="relative group cursor-pointer" title="view the cloud">
				<img src={image.image_url} alt={image.image_url} class="group-hover:opacity-50 h-full object-center object-cover" />
				<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
					<button title="cloud the cloud">
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md text-white">{image.likes}</span>
					</button>
				</div>
			</div>
		{/each}
	</Gallery>

	<Gallery>
		{#each imageArrays[2] as image}
			<div class="relative group cursor-pointer" title="view the cloud">
				<img src={image.image_url} alt={image.image_url} class="group-hover:opacity-50 h-full object-center object-cover" />
				<div class="absolute top-0 p-4 flex text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
					<button title="cloud the cloud">
						<Icon icon="mdi:cloud-outline" class="text-2xl w-7 h-7" />
						<span class="text-md text-white">{image.likes}</span>
					</button>
				</div>
			</div>
		{/each}
	</Gallery>
</Gallery>

<div class="w-full flex justify-center items-center mt-4 border border-slate-500">
	<button class="w-full h-full p-4">
		<span>Load more cloud</span>
	</button>
</div>

