<script lang="ts">
  import { Check, Loader, X } from 'lucide-svelte'
  import { type Agent } from './sideBar.svelte'

  type Props = {
    search: string
    selected: string | null
    onSelect: (val: string) => void
    agents: Agent[]
    agentStatus: string[] | null | undefined
  }

  let { onSelect, selected, search, agents, agentStatus }: Props = $props()

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
      class="w-full rounded px-3.5 pr-8.5 relative py-2.5 text-start text-sm font-semibold transition-all duration-150 ease-out truncate {selected ===
      id
        ? 'bg-neutral-800 text-neutral-100 dark:text-neutral-800 dark:bg-neutral-100'
        : 'cursor-pointer hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 active:scale-98'}"
    >
      {name}
      <div class="absolute right-3 inset-y-0 h-fit my-auto">
        {#if agentStatus === undefined}
          <Loader size="1rem" class="animate-spin" />
        {:else if agentStatus === null || !agentStatus.includes(id)}
          <div
            class="p-0.75 transition-colors duration-150 ease-out {selected ===
            id
              ? 'dark:bg-neutral-800 bg-neutral-100'
              : 'bg-neutral-800 dark:bg-neutral-100'} rounded-full"
          >
            <X
              size="0.75rem"
              class="transition-colors duration-150 ease-out {selected === id
                ? 'dark:text-neutral-100 text-neutral-800'
                : 'text-neutral-100 dark:text-neutral-800'}"
            />
          </div>
        {/if}
      </div>
    </button>
  {/each}

  {#if showAgents.length === 0}
    <p class="text-xs px-2 w-full">
      No agents found with the current search criteria.
    </p>
  {/if}
</div>
