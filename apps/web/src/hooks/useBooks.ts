import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookService } from '@library/services'
import type { BookPayload } from '@library/types'

export const BOOKS_KEY = ['books'] as const

export function useBooks() {
  return useQuery({
    queryKey: BOOKS_KEY,
    queryFn: bookService.getAllBooks,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: BookPayload) => bookService.createBook(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BookPayload> }) =>
      bookService.updateBook(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKS_KEY }),
  })
}