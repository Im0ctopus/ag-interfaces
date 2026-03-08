import type { AgentUsage } from './message'

export type StreamResponse = {
  message?: string
  action?: string
  finishReason?: string
  totalDuration?: number
  detailedDurations?: Record<string, number[]>
  usage?: Record<string, AgentUsage[]>
}
