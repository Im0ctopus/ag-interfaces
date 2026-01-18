<script lang="ts">
  import { ArrowUp, Square } from 'lucide-svelte'
  import Button from '../common/button.svelte'

  type Props = {
    onSend: (value: string) => void
    isAvailable: boolean | undefined
    isLoading: boolean
  }

  let { onSend, isAvailable, isLoading = $bindable() }: Props = $props()

  let value = $state('')

  let textArea: HTMLElement

  const onDivClick = () => textArea.focus()

  const onSendClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (isLoading) isLoading = false
    else {
      onSend(value.trim())
      value = ''
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key
    if (key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() === '' || !isAvailable) return
      onSend(value.trim())
      value = ''
    }
  }
</script>

<div class="w-full">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={onDivClick}
    class="w-full relative cursor-text bg-neutral-100 dark:bg-neutral-900 rounded-t inset-shadow-sm dark:inset-shadow-neutral-950 px-3 py-2"
  >
    <!-- svelte-ignore a11y_autofocus -->
    <textarea
      name="agentInput"
      onkeydown={onKeyDown}
      bind:value
      placeholder="Type your message here..."
      bind:this={textArea}
      autocomplete="off"
      autofocus
      class="w-full min-h-12 max-h-42 resize-none field-sizing-content outline-0 min-w-0"
    ></textarea>
    <div class="w-full flex justify-between items-end">
      <div>
        {#if isAvailable === false}
          <p class="text-xs dark:text-red-400 text-red-500 mb-1">
            This agent is currently unavailable.
          </p>
        {:else if isAvailable === undefined}
          <p class="text-xs dark:text-neutral-600 text-neutral-300 mb-1">
            Checking agent availability...
          </p>
        {/if}
      </div>
      <Button
        disabled={!isLoading && (value.trim() === '' || !isAvailable)}
        onclick={onSendClick}
        variant="icon"
        class="dark:bg-neutral-800 bg-neutral-200 hover:bg-neutral-300"
      >
        {#if isLoading}
          <Square
            size="1.25rem"
            class="dark:fill-neutral-100 fill-neutral-800"
          />
        {:else}
          <ArrowUp size="1.25rem" />
        {/if}
      </Button>
    </div>

    <div
      class="absolute bottom-full bg-linear-to-t from-white dark:from-neutral-800 to-transparent h-11 inset-x-0 flex items-end"
    ></div>
  </div>
</div>
