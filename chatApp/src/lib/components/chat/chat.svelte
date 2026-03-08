<script lang="ts">
  import type { Message } from '$lib/types/message'
  import ChatInput from './chatInput.svelte'
  import { PUBLIC_AGENT_URL } from '$env/static/public'
  import { browser } from '$app/environment'
  import {
    getAgentMessages,
    setAgentMessages,
  } from '$lib/utils/locaStorageHandler'
  import MessageList from './messageList.svelte'
  import { type Agent } from '../../../routes/+page.svelte'
  import type { StreamResponse } from '$lib/types/streamResponse'

  type Props = {
    selected: string | null
    isAvailable: boolean | undefined
    agents: Agent[]
    updateAgentStatus: (
      id: string,
      agentStatus: {
        newMessage?: boolean
        status?: 'loading' | 'writing' | null
        action?: string | null
      },
    ) => void
  }

  let { isAvailable, selected, updateAgentStatus, agents }: Props = $props()

  let messageList: Record<string, Message[]> = $state({})
  // TODO: remove this:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let error: string | null = $state(null)

  let selectedStatus = $derived(
    agents.find((a) => a.id === selected)?.status || null,
  )
  let showMessages: Message[] = $derived(!selected ? [] : messageList[selected])

  let selectedAction = $derived(
    agents.find((a) => a.id === selected)?.action || null,
  )

  $effect(() => {
    if (!browser) return

    const messages = getAgentMessages()
    if (!messages) messageList = {}
    else messageList = messages
  })

  const onSend = async (value: string) => {
    if (!selected) return
    const agentId = selected
    try {
      error = null
      updateAgentStatus(agentId, { status: 'loading' })

      if (!messageList[agentId]) messageList[agentId] = []

      messageList[agentId].push({
        id: messageList[agentId].length,
        content: value,
        role: 'user',
      })
      setAgentMessages(messageList)

      const body = JSON.stringify({
        projectId: agentId,
        messages: messageList[agentId],
      })

      const options: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body,
      }

      const res = await fetch(`${PUBLIC_AGENT_URL}/agent/ask-stream`, options)
      if (!res.ok || !res.body) throw new Error('Network response was not ok')

      const newId = messageList[agentId].length
      messageList[agentId].push({
        id: newId,
        content: '',
        role: 'assistant',
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done || agents.find((a) => a.id === agentId)?.status === null) {
          updateAgentStatus(agentId, { action: null })
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data')) continue
          const res = line.slice(6)

          try {
            const {
              action,
              detailedDurations,
              finishReason,
              message,
              totalDuration,
              usage,
            }: StreamResponse = JSON.parse(res)

            const currentMessage = messageList[agentId][newId]

            if (action) {
              updateAgentStatus(agentId, { action })
            } else if (message) {
              if (agents.find((a) => a.id === agentId)?.status === 'loading') {
                const newStatus = {
                  status: 'writing' as const,
                  action: null,
                  newMessage: false,
                }

                if (agentId !== selected) newStatus.newMessage = true
                updateAgentStatus(agentId, newStatus)
              }

              currentMessage.content += message
            }

            if (finishReason) {
              // TODO: show action on the frontend like the one from google
              // TODO: verify if the finishing reason is ERROR

              if (totalDuration)
                currentMessage.devDetails = {
                  totalDuration,
                  agentUsage: usage || null,
                  detailedDuration: detailedDurations || null,
                }
            }
          } catch (e) {
            // This empty catch is intentional to avoid breaking the stream on JSON parse errors
            console.error(e)
          }
        }
      }
      const newStatus = {
        status: null,
        action: null,
        newMessage: false,
      }

      if (agentId !== selected) newStatus.newMessage = true

      updateAgentStatus(agentId, newStatus)

      setAgentMessages(messageList)
    } catch (e) {
      updateAgentStatus(agentId, {
        status: null,
        action: null,
        newMessage: false,
      })
      console.error(e)
      // TODO: this needs to show something to the user
    }
  }

  const breakAgentResponse = () => {
    if (!selected) return
    updateAgentStatus(selected, { status: null })
  }
</script>

<div class="w-full mx-auto h-full flex flex-col justify-center items-center">
  <MessageList {showMessages} status={selectedStatus} action={selectedAction} />
  <div class="shrink-0 w-full md:max-w-4xl px-2">
    <!-- FIXME: This needs to have the actual loading -->
    <ChatInput
      {onSend}
      {isAvailable}
      isLoading={!!selectedStatus}
      {breakAgentResponse}
    />
  </div>
</div>
