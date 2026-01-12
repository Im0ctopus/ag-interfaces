import type { Message } from '$lib/types/message'

export const setAgentMessages = (messages: { [key: string]: Message[] }) => {
  const messageString = JSON.stringify(messages)
  localStorage.agentsMessages = messageString
}

export const getAgentMessages = () => {
  const messageString = localStorage.agentsMessages

  return messageString ? JSON.parse(messageString) : null
}
