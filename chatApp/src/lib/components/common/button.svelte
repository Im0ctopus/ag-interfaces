<script lang="ts">
  import { twm } from '$lib/utils/index'
  import {
    type HTMLButtonAttributes,
    type HTMLAnchorAttributes,
  } from 'svelte/elements'
  import type { ClassNameValue } from 'tailwind-merge'

  type Props = HTMLButtonAttributes &
    HTMLAnchorAttributes & {
      variant?: 'icon' | 'default'
      fullWidth?: boolean
    }

  let {
    class: customClassName,
    variant = 'default',
    href = undefined,
    disabled,
    children,
    fullWidth = false,
    ...rest
  }: Props = $props()

  let variants: { [key: string]: ClassNameValue } = $derived({
    default: `${fullWidth && 'w-full'}`,
    icon: 'p-1.5 hover:bg-neutral-900/5 dark:hover:bg-neutral-100/10',
  })

  // Default className
  const className =
    'active:scale-97 transition-all duration-150 rounded disabled:opacity-50 disabled:cursor-not-allowed'
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
