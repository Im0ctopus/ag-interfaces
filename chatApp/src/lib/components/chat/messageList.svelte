<script lang="ts">
  import type { Message } from '$lib/types/message'
  import { ChevronDown } from 'lucide-svelte'
  import Button from '../common/button.svelte'

  type Props = {
    showMessages: Message[]
  }

  let { showMessages }: Props = $props()

  let scrollToSpan: HTMLElement

  let showScrollTo = $state(false)
  let firstLoad = $state(true)

  const scrollToBottom = (behavior: ScrollBehavior) => {
    scrollToSpan.scrollIntoView({ behavior })
  }

  $effect(() => {
    // TODO: this runs twice
    if (!showMessages || showMessages.length === 0) return
    if (firstLoad) {
      scrollToBottom('instant')
      firstLoad = false
    }
    scrollToBottom('smooth')
  })

  $effect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showScrollTo = false
        } else {
          showScrollTo = true
        }
      })
    })

    observer.observe(scrollToSpan)
  })
</script>

<div class="overflow-x-clip overflow-y-scroll w-full grow">
  <div
    class="grow relative min-h-0 py-10 px-4 md:max-w-4xl w-full mx-auto flex flex-col justify-center items-start gap-7"
  >
    {#each showMessages as { content, role }}
      <div
        class="w-full flex items-center {role === 'user'
          ? 'justify-end'
          : 'justify-start'}"
      >
        <p
          class="w-fit whitespace-pre-line break-all rounded p-2.5 {role ===
          'user'
            ? 'max-w-6/12 bg-neutral-800 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-800'
            : 'max-w-11/12'}"
        >
          {content}
        </p>
      </div>
    {/each}
    <span class="absolute bottom-4" bind:this={scrollToSpan}></span>
  </div>
</div>

<div class="relative flex items-center justify-center">
  <button
    onclick={() => scrollToBottom('smooth')}
    class="{!showScrollTo
      ? 'opacity-0 pointer-events-none bottom-2'
      : 'bottom-3'} absolute transition-[background-color,scale,opacity,bottom] active:scale-99 duration-150 ease-out z-20 flex justify-center items-center gap-1 bg-neutral-100/50 hover:bg-neutral-200/50 text-neutral-500 dark:bg-neutral-950/50 dark:hover:bg-neutral-900/50 dark:text-neutral-400 px-2.5 py-1.25 rounded backdrop-blur-[2px]"
  >
    <p class="text-nowrap text-sm">Scroll to bottom</p>
    <ChevronDown size="1.25rem" />
  </button>
</div>
