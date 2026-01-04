<script lang="ts">
  import { PanelLeft } from 'lucide-svelte'
  import Button from '../common/button.svelte'

  type Props = {
    isOpen: boolean
    toggleOpen: () => void
  }

  let { isOpen, toggleOpen }: Props = $props()
</script>

<Button variant="icon" class="absolute z-20 left-3 top-5" onclick={toggleOpen}>
  <PanelLeft size="1.25rem" />
</Button>

<!-- TODO: mobile layout needs to be "full" -->
<div
  class="shrink-0 self-stretch min-w-0 w-full transition-[max-width] duration-150 ease-out overflow-clip {isOpen
    ? 'max-w-64'
    : 'max-w-0'}"
>
  <div class="flex flex-col justify-start items-center gap-3 w-64 pt-5.5 px-3">
    <p class="px-7.5 w-full text-center text-xl font-semibold">Agents</p>
    <div>search input</div>
  </div>
</div>
