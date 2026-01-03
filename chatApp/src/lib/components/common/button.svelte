<script lang="ts">
  import { twm } from '$lib/utils'
  import {
    type HTMLButtonAttributes,
    type HTMLAnchorAttributes,
  } from 'svelte/elements'
  import type { ClassNameValue } from 'tailwind-merge'

  type Props = HTMLButtonAttributes &
    HTMLAnchorAttributes & {
      variant?: 'icon' | 'default'
    }

  let {
    class: customClassName,
    variant = 'default',
    href = undefined,
    disabled,
    children,
    ...rest
  }: Props = $props()

  const variants: { [key: string]: ClassNameValue } = {
    default: '',
    icon: 'p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800',
  }

  // Default className
  const className = 'active:scale-97 transition-all duration-150 rounded'
</script>

{#if href}
  <a
    href={disabled ? undefined : href}
    class={twm(className, variants[variant], customClassName)}
    {...rest}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {disabled}
    class={twm(className, variants[variant], customClassName)}
    {...rest}
  >
    {@render children?.()}
  </button>
{/if}
