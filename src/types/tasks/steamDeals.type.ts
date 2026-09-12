import type { DealsDiff } from '#types/db/steamDb.type.ts'

export interface UpdateResult {
  cc: string
  lang: string
  total: number
  diff: DealsDiff
}