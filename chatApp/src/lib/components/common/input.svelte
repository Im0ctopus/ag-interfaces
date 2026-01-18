<script lang="ts">
  import { twm } from '$lib/utils/index'
  import { Search, X } from 'lucide-svelte'
  import { type HTMLInputAttributes } from 'svelte/elements'
  import Button from './button.svelte'

  type Props = HTMLInputAttributes & {
    variant: 'default' | 'search'
  }

  let {
    class: customClassName,
    value = $bindable(),
    'data-slot': dataSlot = 'input',
    variant = 'default',
    ...rest
  }: Props = $props()

  const className = 'px-2 py-1 rounded outline-none text-sm font-medium'

  const onClear = () => {
    value = ''
  }
</script>

{#if variant === 'search'}
  <div
    class="relative flex w-fit justify-center items-center border-b border-neutral-300 dark:border-neutral-700 px-2"
  >
    <Search
      size="1rem"
      class="shrink-0 text-neutral-600 dark:text-neutral-500"
    />
    <input
      data-slot={dataSlot}
      bind:value
      class={twm(className, 'py-2 shrink-0 pr-7 ', customClassName)}
      {...rest}
    />
    {#if value.length > 0}
      <Button
        onclick={onClear}
        variant="icon"
        class="absolute right-2 p-1 shrink-0"
      >
        <X size="1rem" />
      </Button>
    {/if}
  </div>
{:else}
  <input
    data-slot={dataSlot}
    bind:value
    class={twm(className, 'bg-neutral-950/5 dark:bg-white/5', customClassName)}
    {...rest}
  />
{/if}
