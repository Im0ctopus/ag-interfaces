<script lang="ts">
  import type { Message } from '$lib/types/message'
  import ChatInput from './chatInput.svelte'
  import { PUBLIC_AGENT_URL } from '$env/static/public'
  import { browser } from '$app/environment'

  type Props = {
    selected: string | null
    isAvailable: boolean | undefined
  }

  let messageList: Message[] = $state([])
  let isLoading: boolean = $state(false)
  let isResponding: boolean = $state(false)
  let error: string | null = $state(null)

  let { isAvailable, selected }: Props = $props()

  $effect(() => {
    if (!browser || !selected) return

    const messagesString = localStorage[selected]
    if (!messagesString) messageList = []
    else {
      const messages = JSON.parse(messagesString)
      messageList = messages
    }
  })

  const onSend = async (value: string) => {
    if (!selected) return
    try {
      error = null
      isLoading = true

      messageList.push({
        id: messageList.length,
        content: value,
        role: 'user',
      })
      localStorage[selected] = JSON.stringify(messageList)

      const body = JSON.stringify({
        projectId: selected,
        messages: messageList,
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

      const newId = messageList.length
      messageList.push({
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
        const lines = buffer.split('\n')
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
              messageList[messageList.length - 1].content += message
            }
            // TODO: show action on the frontend like the one from google
            // TODO: verify if the finishing reason is ERROR
          } catch (e) {
            // This empty catch is intentional to avoid breaking the stream on JSON parse errors
          }
        }
      }

      isLoading = false
      isResponding = false
      localStorage[selected] = JSON.stringify(messageList)
    } catch (e) {
      console.error(e)
      error = 'An error occurred, please try again.'
    } finally {
      isResponding = false
    }
  }
</script>

<div class="w-full md:max-w-5xl mx-auto h-full px-3 flex flex-col">
  <div class="grow min-h-0 w-full">
    {#each messageList as message}
      <p>{message.content}</p>
    {/each}
    <!-- TODO: messages list -->
  </div>
  <div class="shrink-0 w-full">
    <ChatInput {onSend} {isAvailable} bind:isLoading />
  </div>
</div>
