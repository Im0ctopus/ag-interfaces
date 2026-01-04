<script lang="ts">
  import { browser } from '$app/environment'
  import Chat from '$lib/components/chat/chat.svelte'
  import SideBar from '$lib/components/sideBar/sideBar.svelte'

  // TODO: This needs to be stored in localstorage.sidebar
  let isSideOpen = $state(false)

  $effect(() => {
    if (!browser) return
    isSideOpen = localStorage.sideBar === 'true'
  })

  const toggleOpen = () => {
    isSideOpen = !isSideOpen
    localStorage.sideBar = isSideOpen
  }
</script>

<div
  class="flex justify-center items-start min-h-screen w-screen overflow-clip"
>
  <SideBar isOpen={isSideOpen} {toggleOpen} />
  <div
    class="grow self-stretch shrink-0 min-w-0 bg-white dark:bg-neutral-800 transition-[margin-top,border-top-left-radius] duration-150 ease-out {isSideOpen &&
      'mt-3 rounded-tl-xl'}"
  >
    <Chat />
  </div>
</div>
