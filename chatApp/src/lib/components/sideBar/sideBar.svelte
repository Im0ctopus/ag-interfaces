<script lang="ts" module>
  export type Agent = {
    id: string
    name: string
  }
</script>

<script lang="ts">
  import { PanelLeft } from 'lucide-svelte'
  import Button from '../common/button.svelte'
  import Input from '../common/input.svelte'
  import AgentList from './agentList.svelte'
  import { PUBLIC_AGENTS } from '$env/static/public'
  import { browser } from '$app/environment'

  type Props = {
    isOpen: boolean
    toggleOpen: () => void
  }

  let { isOpen, toggleOpen }: Props = $props()

  let agents: Agent[] = JSON.parse(PUBLIC_AGENTS)

  let search = $state('')
  // TODO: this selected should be defaulted and should come from the localStorage
  let selected: string | null = $state(null)

  $effect(() => {
    if ((!agents || agents.length <= 1) && isOpen) toggleOpen()
    if (!agents)
      throw new Error('No agents found in environment variable PUBLIC_AGENTS')
  })

  $effect(() => {
    if (!browser) return
    const agent: string = localStorage.agent
    if (!agents.find((a) => a.id === agent)) {
      agents[0].id
      throw new Error('Saved agent not found in agents list')
    }

    selected = agent
  })

  const onSelect = (val: string) => {
    selected = val
    localStorage.agent = selected
  }
</script>

{#if agents.length > 1}
  <Button
    variant="icon"
    class="absolute z-20 left-3 top-5"
    onclick={toggleOpen}
  >
    <PanelLeft size="1.25rem" />
  </Button>

  <!-- TODO: mobile layout needs to be "full" -->
  <div
    class="shrink-0 self-stretch min-w-0 w-full transition-[max-width] duration-150 ease-out overflow-clip {isOpen
      ? 'max-w-64'
      : 'max-w-0'}"
  >
    <div
      class="flex flex-col justify-start items-center gap-3 w-64 pt-5.5 px-3"
    >
      <p class="px-7.5 w-full text-center text-xl font-semibold">Agents</p>
      <Input variant="search" bind:value={search} />
      <AgentList {onSelect} {search} {selected} {agents} />
    </div>
  </div>
{/if}
