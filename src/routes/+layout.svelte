<script>
	import "../app.css";
	import Icon from '@iconify/svelte';
	
</script>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

  :global(body) {
		color: #B6C4B6;
    background-color: #222831;
		font-family: "Noto Sans", sans-serif;
		padding: 0 1rem;
  }
</style>

<nav class="flex items-center justify-between max-w-4xl  mx-auto py-4">
	<div>
		<h1 class="text-xl font-bold">CloudBuddy</h1>
	</div>
	<div>
		<a href="/login" class="group">
			<Icon icon="mdi:user" class="text-3xl group-hover:opacity-80" />
		</a>
	</div>
</nav>

<div style="height: calc(100vh - 4rem - 4rem)">
	<slot />
</div>

<footer class="flex justify-center items-center p-4 ">
	<a href="/github">
		<Icon icon="mdi:github" class="text-xl inline mb-1" />
	</a>
	<span class="mb-1">&nbsp;|&nbsp;</span>
	<p>
		<span>Made with lots of&nbsp;</span>
		<span><Icon icon="bi:clouds-fill" class="text-xl inline mb-1" /></span>
	</p>
</footer>
