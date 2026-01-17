<script lang="ts">
  import type { Message } from '$lib/types/message'
  import ChatInput from './chatInput.svelte'
  import { PUBLIC_AGENT_URL } from '$env/static/public'
  import { browser } from '$app/environment'
  import {
    getAgentMessages,
    setAgentMessages,
  } from '$lib/utils/locaStorageHandler'

  type Props = {
    selected: string | null
    isAvailable: boolean | undefined
    newUnreadMessage: (agentId: string) => void
  }

  let { isAvailable, selected, newUnreadMessage }: Props = $props()

  let messageList: { [key: string]: Message[] } = $state({})
  let isLoading: boolean = $state(false)
  let isResponding: boolean = $state(false)
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
      isLoading = true

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
        if (done || !isLoading) break

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
              isResponding = true
              if (agentId !== selected && !isResponding)
                newUnreadMessage(agentId)

              messageList[agentId][newId].content += message
            }
            // TODO: show action on the frontend like the one from google
            // TODO: verify if the finishing reason is ERROR
          } catch (e) {
            // This empty catch is intentional to avoid breaking the stream on JSON parse errors
          }
        }
      }

      if (agentId !== selected) newUnreadMessage(agentId)

      isLoading = false
      isResponding = false
      setAgentMessages(messageList)
    } catch (e) {
      console.error(e)
      error = 'An error occurred, please try again.'
    } finally {
      isResponding = false
    }
  }
</script>

<div class="w-full mx-auto h-full flex flex-col justify-center items-center">
  <div class="overflow-x-clip overflow-y-scroll w-full grow">
    <div
      class="grow min-h-0 py-2 px-4 md:max-w-4xl w-full mx-auto pb-10 flex flex-col justify-center items-start gap-1"
    >
      {#each showMessages as { content, role }}
        <p>{content}/{role}</p>
        <div class="w-full"></div>
      {/each}
    </div>
    <!-- TODO: messages list -->
  </div>
  <div class="shrink-0 w-full md:max-w-4xl px-2">
    <ChatInput {onSend} {isAvailable} bind:isLoading />
  </div>
</div>
