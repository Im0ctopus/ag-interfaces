<script lang="ts" module>
  export type Agent = {
    id: string
    name: string
    newMessage: boolean
  }
</script>

<script lang="ts">
  import { browser } from '$app/environment'
  import Chat from '$lib/components/chat/chat.svelte'
  import SideBar from '$lib/components/sideBar/sideBar.svelte'
  import { PUBLIC_AGENT_URL } from '$env/static/public'
  import { PUBLIC_AGENTS } from '$env/static/public'

  let isSideOpen = $state(false)
  let agentStatus: string[] | null | undefined = $state() //undefined is loading & null is when the runner is down
  let selected: string | null = $state(null)
  let agents: Agent[] = $state(
    JSON.parse(PUBLIC_AGENTS).map((a: any) => ({ ...a, new: false })),
  )

  $effect(() => {
    if (!browser) return
    isSideOpen = localStorage.sideBar === 'true'
  })

  $effect(() => {
    if (!browser) return

    const getAgentHealth = async () => {
      try {
        const res = await fetch(`${PUBLIC_AGENT_URL}/healthz`)
        const data = await res.json()

        agentStatus = data.agents as string[]
      } catch (e) {
        agentStatus = null
        console.error('Error fetching agent health:', e)
      }
    }

    getAgentHealth()
  })

  const toggleOpen = () => {
    isSideOpen = !isSideOpen
    localStorage.sideBar = isSideOpen
  }

  const newUnreadMessage = (agentId: string) => {
    const agentToUpdate = agents.findIndex((a) => a.id === agentId)
    if (agentToUpdate === -1) return
    agents[agentToUpdate].newMessage = true
  }

  const markAsRead = (agentId: string) => {
    const agentToUpdate = agents.findIndex((a) => a.id === agentId)
    if (agentToUpdate === -1) return
    agents[agentToUpdate].newMessage = false
  }
</script>

<div class="flex justify-center items-start h-screen w-full overflow-clip">
  <SideBar
    isOpen={isSideOpen}
    {toggleOpen}
    {agentStatus}
    bind:selected
    {agents}
    {markAsRead}
  />
  <div
    class="grow outline self-stretch min-w-0 bg-white dark:bg-neutral-800 transition-[margin-top,border-top-left-radius,outline-color] duration-150 ease-out {isSideOpen
      ? 'mt-3 rounded-tl-xl dark:outline-neutral-700 outline-neutral-200 shadow'
      : 'outline-transparent'}"
  >
    <Chat
      {selected}
      isAvailable={agentStatus === undefined
        ? undefined
        : agentStatus?.includes(selected || '') || false}
      {newUnreadMessage}
    />
  </div>
</div>
