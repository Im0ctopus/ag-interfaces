<script lang="ts">
  import { ArrowUp } from 'lucide-svelte'
  import Button from '../common/button.svelte'

  type Props = {
    onSend: (value: string) => void
    isAvailable: boolean | undefined
  }

  let { onSend, isAvailable }: Props = $props()

  let value = $state('')

  let textArea: HTMLElement

  const onDivClick = () => textArea.focus()

  const onSendClick = (e: MouseEvent) => {
    e.stopPropagation()
  }
</script>

<div class="w-full max-w-3xl mx-auto">
  {#if isAvailable === false}
    <p class="text-xs dark:text-red-400 font-semibold text-red-500 mb-1">
      This agent is currently unavailable.
    </p>
  {:else if isAvailable === undefined}
    <p
      class="text-xs dark:text-neutral-600 font-semibold text-neutral-300 mb-1"
    >
      Checking agent availability...
    </p>
  {/if}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={onDivClick}
    class="w-full cursor-text bg-neutral-100 dark:bg-neutral-900 rounded-t inset-shadow-sm dark:inset-shadow-neutral-950 px-3 py-2"
  >
    <!-- svelte-ignore a11y_autofocus -->
    <textarea
      bind:value
      placeholder="Type your message here..."
      bind:this={textArea}
      autocomplete="off"
      autofocus
      class="w-full min-h-12 max-h-42 resize-none font-semibold field-sizing-content outline-0"
    ></textarea>
    <div class="w-full flex justify-end items-center">
      <Button
        disabled={value.trim() === '' || !isAvailable}
        onclick={onSendClick}
        variant="icon"
        class="dark:bg-neutral-800 bg-neutral-200 hover:bg-neutral-300"
      >
        <ArrowUp size="1.25rem" />
      </Button>
    </div>
  </div>
</div>
