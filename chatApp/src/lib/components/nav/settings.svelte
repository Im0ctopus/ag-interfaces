<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte'
  import Button from '../common/button.svelte'

  type Props = {
    isOpen: boolean
    onClose: () => void
  }

  let { isOpen, onClose }: Props = $props()

  let render = $state(false)
  let animate = $state(false)

  let theme: 'dark' | 'light' = $state('light')

  $effect(() => {
    let timeOut: ReturnType<typeof setTimeout>

    if (isOpen) {
      render = true
      timeOut = setTimeout(() => (animate = true), 0)
    } else {
      animate = false
      timeOut = setTimeout(() => (render = false), 150)
    }

    return () => clearTimeout(timeOut)
  })

  $effect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!localStorage.theme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      theme = 'dark'
    } else {
      theme = 'light'
    }
  })

  const toggleDark = () => {
    theme = 'dark'
    document.documentElement.classList.add('dark')
    document.documentElement.style.setProperty('color-scheme', 'dark')
    localStorage.theme = 'dark'
  }

  const toggleLight = () => {
    theme = 'light'
    document.documentElement.classList.remove('dark')
    document.documentElement.style.setProperty('color-scheme', 'light')
    localStorage.theme = 'light'
  }
</script>

{#if isOpen}
  <button
    aria-label="Close settings"
    class="fixed inset-0 z-40"
    onclick={onClose}
  ></button>
{/if}
{#if render}
  <div
    style="top: calc(100% + 2.5px);"
    class="rounded p-2 dark:bg-neutral-800 bg-neutral-100 shadow absolute z-50 right-0 transition-all duration-150 ease-out {!animate &&
      'opacity-0 scale-93 blur-xs pointer-events-none'}"
  >
    <div class="flex justify-center items-center gap-2">
      <p class="text-sm font-semibold">Theme</p>
      <div
        class="relative flex justify-center items-center gap-1 bg-white dark:bg-neutral-900 rounded p-1"
      >
        <Button
          variant="icon"
          onclick={toggleLight}
          class="z-10 cursor-pointer {theme === 'light' &&
            'hover:bg-transparent'}"
        >
          <Sun size="1rem" />
        </Button>
        <Button
          variant="icon"
          onclick={toggleDark}
          class="z-10 cursor-pointer {theme === 'dark' &&
            'dark:hover:bg-transparent'}"
        >
          <Moon size="1rem" />
        </Button>
        <div
          class="absolute bg-neutral-200 dark:bg-neutral-700 aspect-square w-7 transition-[left] duration-150 ease-out rounded z-0"
          style="left: {theme === 'light' ? '4px' : '36px'};"
        ></div>
      </div>
    </div>
  </div>
{/if}
