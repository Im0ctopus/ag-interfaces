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

  type Props = {
    selected: string | null
    isAvailable: boolean | undefined
    status: 'loading' | 'writing' | null
    updateAgentStatus: (
      id: string,
      agentStatus: {
        newMessage?: boolean
        status?: 'loading' | 'writing' | null
        action?: string | null
      },
    ) => void
  }

  let { isAvailable, selected, updateAgentStatus, status }: Props = $props()

  let messageList: { [key: string]: Message[] } = $state({})
  let error: string | null = $state(null)

  let showMessages: Message[] = $derived(!selected ? [] : messageList[selected])

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
        if (done || status === null) {
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
            const data = JSON.parse(res)
            const action = data.action as string | undefined
            const message = data.message as string | undefined
            const finishReason = data.finishReason as string | undefined

            if (message) {
              if (status === 'loading') {
                const newStatus = {
                  status: 'writing' as const,
                  newMessage: false,
                }

                if (agentId !== selected) newStatus.newMessage = true
                updateAgentStatus(agentId, newStatus)
              }

              messageList[agentId][newId].content += message
            }
            // TODO: show action on the frontend like the one from google
            // TODO: verify if the finishing reason is ERROR
          } catch (e) {
            // This empty catch is intentional to avoid breaking the stream on JSON parse errors
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
  <MessageList {showMessages} />
  <div class="shrink-0 w-full md:max-w-4xl px-2">
    <!-- FIXME: This needs to have the actual loading -->
    <ChatInput
      {onSend}
      {isAvailable}
      isLoading={!!status}
      {breakAgentResponse}
    />
  </div>
</div>
