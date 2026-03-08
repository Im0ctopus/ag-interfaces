<script lang="ts">
  import type { MessageDevDetails } from '$lib/types/message'
  import { ChevronRight, Minus } from 'lucide-svelte'

  let { detailedDuration, totalDuration }: MessageDevDetails = $props()

  let isOpen = $state(false)

  const toggleOpen = () => (isOpen = !isOpen)

  let totalDurationRef: HTMLSpanElement | null = $state(null)
</script>

<div class="-mt-1 ml-2 w-full">
  <button
    style="max-width: {isOpen
      ? '100%'
      : `${(totalDurationRef?.scrollWidth || 0) + 34}px`};"
    class="relative w-fit transition-[color,max-width] duration-300 rounded-lg rounded-tl dark:bg-neutral-900/50 bg-neutral-100 p-2 py-0 pr-5 text-sm dark:text-neutral-400 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-800 cursor-pointer"
    onclick={toggleOpen}
  >
    <div class="flex justify-start items-center text-nowrap gap-0.5 w-full">
      <p bind:this={totalDurationRef}>
        Total duration: {totalDuration} ms
      </p>
      <Minus size="1.25rem" class="shrink-0 rotate-90" />
      <div
        class="overflow-x-auto min-w-0 py-2.5 flex justify-start items-center"
      >
        {#if detailedDuration}
          <p class="flex justify-center items-center">
            <span> Detailed durations: </span>
            {#each Object.entries(detailedDuration).map((d) => d) as [agent, durations], index (agent)}
              {#if index}
                <span class="px-1">-</span>
              {/if}
              <span>
                <span class="px-1">{agent}:</span>
                [
                {#each durations as duration, index (index)}
                  {#if index}
                    <span>, </span>
                  {/if}
                  {duration} ms
                {/each}
                ]
              </span>
            {/each}
          </p>
        {/if}
      </div>
      <div class="absolute right-0 dark:bg-neutral-900/50 bg-neutral-100">
        <ChevronRight
          size="1.25rem"
          class="{isOpen
            ? 'rotate-180'
            : ''} transition-[rotate] ease-out shrink-0"
        />
      </div>
    </div>
  </button>
</div>
