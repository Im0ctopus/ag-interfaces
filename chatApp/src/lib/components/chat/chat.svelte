<script lang="ts">
  import ChatInput from './chatInput.svelte'

  type Props = {
    selected: string | null
    isAvailable: boolean | undefined
  }

  let { isAvailable, selected }: Props = $props()

  const onSend = (value: string) => {
    // TODO: implement this
    console.log(`sending ${value} to ${selected}`)
  }
</script>

<div class="w-full max-w-5xl mx-auto h-full px-3 flex flex-col">
  <div class="grow min-h-0 w-full">
    <!-- TODO: messages list -->
  </div>
  <div class="shrink-0 w-full">
    <ChatInput {onSend} {isAvailable} />
  </div>
</div>
