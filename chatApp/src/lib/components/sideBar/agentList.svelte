<script lang="ts">
  import { type Agent } from './sideBar.svelte'

  type Props = {
    search: string
    selected: string | null
    onSelect: (val: string) => void
    agents: Agent[]
  }

  let { onSelect, selected, search, agents }: Props = $props()

  let showAgents = $derived(
    agents.filter((ag) =>
      ag.name.toLowerCase().trim().includes(search.toLowerCase().trim())
    )
  )
</script>

<div class="flex flex-col just-center items-center gap-2 w-full">
  {#each showAgents as { id, name }, index (index)}
    <button
      onclick={() => onSelect(id)}
      class="w-full rounded px-3.5 py-2.5 text-start text-sm font-semibold transition-all truncate {selected ===
      id
        ? 'bg-neutral-800 text-white dark:text-neutral-900 dark:bg-white'
        : 'cursor-pointer hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 active:scale-98'}"
    >
      {name}
    </button>
  {/each}

  {#if showAgents.length === 0}
    <p class="text-xs px-2 w-full">
      No agents found with the current search criteria.
    </p>
  {/if}
</div>
