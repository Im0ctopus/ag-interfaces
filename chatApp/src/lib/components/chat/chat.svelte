<script lang="ts">
  type Props = {
    selected: string | null
    isAvailable: boolean | undefined
  }

  let { isAvailable, selected }: Props = $props()
</script>

<div class="w-full max-w-5xl mx-auto h-full px-3 flex flex-col">
  <div class="grow min-h-0 w-full">
    <!-- TODO: messages list -->
  </div>
  {#if isAvailable === false}
    <p class="text-xs dark:text-red-400 font-semibold text-red-500 mb-1">
      This agent is currently unavailable.
    </p>
  {/if}
  <div class="shrink-0 w-full">
    <!-- TODO: message textArea -->
  </div>
</div>
