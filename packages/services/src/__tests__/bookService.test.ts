import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@library/db', () => {
  const store = new Map()
  const make = () => ({
    setItem: vi.fn(async (k, v) => { store.set(k, v); return v }),
    getItem: vi.fn(async (k) => store.get(k) ?? null),
    removeItem: vi.fn(async (k) => store.delete(k)),
    iterate: vi.fn(async (fn) => store.forEach((v) => fn(v))),
  })
  return { booksDb: make(), authorsDb: make() }
})

import { createBook, getBookById, updateBook, deleteBook } from '../bookService'

describe('bookService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('cria um livro com id e created_at', async () => {
    const book = await createBook({ name: 'Dom Casmurro', author_id: 'a1', pages: 256 })
    expect(book.id).toBeTruthy()
    expect(book.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('retorna null ao buscar id inexistente', async () => {
    expect(await getBookById('ghost')).toBeNull()
  })

  it('retorna null ao atualizar id inexistente', async () => {
    expect(await updateBook('ghost', { name: 'X' })).toBeNull()
  })

  it('deleta um livro', async () => {
    const book = await createBook({ name: 'Teste', author_id: 'a1' })
    await deleteBook(book.id)
    expect(await getBookById(book.id)).toBeNull()
  })
})