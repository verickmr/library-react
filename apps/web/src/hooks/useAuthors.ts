import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authorService, bookService } from '@library/services'
import type { AuthorPayload } from '@library/types'
import { BOOKS_KEY } from './useBooks'

export const AUTHORS_KEY = ['authors'] as const

export function useAuthors() {
  return useQuery({
    queryKey: AUTHORS_KEY,
    queryFn: authorService.getAllAuthors,
  })
}

export function useCreateAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AuthorPayload) => authorService.createAuthor(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: AUTHORS_KEY }),
  })
}

export function useUpdateAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AuthorPayload> }) =>
      authorService.updateAuthor(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: AUTHORS_KEY }),
  })
}

export function useDeleteAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await bookService.deleteBooksByAuthor(id)
      await authorService.deleteAuthor(id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTHORS_KEY })
      qc.invalidateQueries({ queryKey: BOOKS_KEY })
    },
  })
}