export type Message = {
  id: number
  content: string
  role: 'user' | 'assistant'
  devDetails?: MessageDevDetails
}

export type MessageDevDetails = {
  totalDuration: number
  detailedDuration: Record<string, number[]> | null
  agentUsage: Record<string, AgentUsage[]> | null
}

export type AgentUsage = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}
