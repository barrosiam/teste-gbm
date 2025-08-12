export const STATUS_BADGE = {
  Criada: { color: 'blue', variant: 'soft' as const },
  Processando: { color: 'amber', variant: 'soft' as const },
  Finalizada: { color: 'green', variant: 'soft' as const },
}

export type StatusKey = keyof typeof STATUS_BADGE
