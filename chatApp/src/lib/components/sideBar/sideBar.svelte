<script lang="ts">
  import { PanelLeftClose, PanelLeftOpen } from 'lucide-svelte'
  import Button from '../common/button.svelte'
  import Input from '../common/input.svelte'
  import AgentList from './agentList.svelte'
  import { browser } from '$app/environment'
  import { type Agent } from '../../../routes/+page.svelte'
  import Ping from '../common/ping.svelte'

  type Props = {
    isOpen: boolean
    toggleOpen: () => void
    agentStatus: string[] | null | undefined
    selected: string | null
    agents: Agent[]
    markAsRead: (agentId: string) => void
  }

  let {
    isOpen,
    toggleOpen,
    agentStatus,
    selected = $bindable(),
    agents,
    markAsRead,
  }: Props = $props()

  let search = $state('')

  $effect(() => {
    if (!browser) return
    if ((!agents || agents.length <= 1) && isOpen) toggleOpen()
    if (!agents)
      throw new Error('No agents found in environment variable PUBLIC_AGENTS')
  })

  $effect(() => {
    if (!browser) return
    const agent: string = localStorage.agent
    if (!agents.find((a) => a.id === agent)) {
      agents[0].id
      console.error('Saved agent not found in agents list')
    } else selected = agent
  })

  const onSelect = (val: string, newMessage: boolean) => {
    if (selected === val) return

    selected = val
    localStorage.agent = selected

    if (newMessage) markAsRead(val)
  }
</script>

{#if agents.length > 1}
  <Button
    variant="icon"
    class="absolute z-20 left-3 top-3.5"
    onclick={toggleOpen}
  >
    <PanelLeftClose
      size="1.25rem"
      class="absolute transition-[opacity,scale,filter] duration-300 ease-out {!isOpen &&
        'opacity-0 scale-75 blur-xs'}"
    />
    <PanelLeftOpen
      size="1.25rem"
      class="transition-[opacity,scale,filter] duration-300 ease-out {isOpen &&
        'opacity-0 scale-75 blur-xs'}"
    />
    {#if !isOpen && agents.find((a) => a.newMessage)}
      <div class="absolute top-1 right-1">
        <Ping />
      </div>
    {/if}
  </Button>

  <!-- TODO: mobile layout needs to be "full" -->
  <div
    class="shrink-0 self-stretch min-w-0 w-full transition-[max-width] duration-150 ease-out overflow-clip {isOpen
      ? 'max-w-64'
      : 'max-w-0'}"
  >
    <div class="flex flex-col justify-start items-center gap-3 w-64 pt-4 px-3">
      <p class="px-7.5 w-full text-center text-xl font-semibold">Agents</p>
      <Input variant="search" bind:value={search} />
      <AgentList {onSelect} {search} {selected} {agents} {agentStatus} />
    </div>
  </div>
{/if}
