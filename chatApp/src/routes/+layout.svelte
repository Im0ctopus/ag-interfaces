<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.svg'

  let { children } = $props()
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main
  class="antialiased min-h-screen relative flex gap-0 justify-start items-start"
>
  {@render children()}
</main>
