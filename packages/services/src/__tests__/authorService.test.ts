import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authorService } from '../index'

vi.mock('@library/db', () => {
  const store = new Map<string, unknown>()
  const makeInstance = () => ({
    getItem: (key: string) => Promise.resolve(store.get(key) ?? null),
    setItem: (key: string, value: unknown) => { store.set(key, value); return Promise.resolve(value) },
    removeItem: (key: string) => { store.delete(key); return Promise.resolve() },
    iterate: (cb: (value: unknown, key: string) => void) => {
      store.forEach((value, key) => cb(value, key))
      return Promise.resolve()
    },
  })
  return {
    booksDb: makeInstance(),
    authorsDb: makeInstance(),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authorService', () => {
  it('creates an author with id and created_at', async () => {
    const author = await authorService.createAuthor({ name: 'Machado de Assis', email: 'machado@lit.br' })
    expect(author.id).toBeDefined()
    expect(author.created_at).toBeDefined()
    expect(author.name).toBe('Machado de Assis')
    expect(author.email).toBe('machado@lit.br')
  })

  it('returns null for missing author', async () => {
    const author = await authorService.getAuthorById('nao-existe')
    expect(author).toBeNull()
  })

  it('returns null when updating missing author', async () => {
    const result = await authorService.updateAuthor('nao-existe', { name: 'Novo' })
    expect(result).toBeNull()
  })

  it('deletes an author', async () => {
    const author = await authorService.createAuthor({ name: 'Clarice Lispector' })
    await authorService.deleteAuthor(author.id)
    const result = await authorService.getAuthorById(author.id)
    expect(result).toBeNull()
  })
})