import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import type { Author, AuthorPayload } from '@library/types'
import { authorsDb } from '@library/db'

export async function getAllAuthors(): Promise<Author[]> {
  const authors: Author[] = []
  await authorsDb.iterate<Author, void>((value) => {
    authors.push(value)
  })
  return authors.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))
}

export async function getAuthorById(id: string): Promise<Author | null> {
  return authorsDb.getItem<Author>(id)
}

export async function createAuthor(payload: AuthorPayload): Promise<Author> {
  const author: Author = {
    ...payload,
    id: uuidv4(),
    created_at: dayjs().toISOString(),
  }
  await authorsDb.setItem(author.id, author)
  return author
}

export async function updateAuthor(
  id: string,
  payload: Partial<AuthorPayload>
): Promise<Author | null> {
  const existing = await getAuthorById(id)
  if (!existing) return null
  const updated = { ...existing, ...payload }
  await authorsDb.setItem(id, updated)
  return updated
}

export async function deleteAuthor(id: string): Promise<void> {
  await authorsDb.removeItem(id)
}

