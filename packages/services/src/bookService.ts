import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { booksDb } from '@library/db'
import type { Book, BookPayload } from '@library/types'

export async function getAllBooks(): Promise<Book[]> {
  const books: Book[] = []
  await booksDb.iterate<Book, void>((value) => {
    books.push(value)
  })
  return books.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))
}

export async function getBookById(id: string): Promise<Book | null> {
  return booksDb.getItem<Book>(id)
}

export async function getBooksByAuthor(authorId: string): Promise<Book[]> {
  const all = await getAllBooks()
  return all.filter((b) => b.author_id === authorId)
}

export async function createBook(payload: BookPayload): Promise<Book> {
  const book: Book = {
    ...payload,
    id: uuidv4(),
    created_at: dayjs().toISOString(),
  }
  await booksDb.setItem(book.id, book)
  return book
}

export async function updateBook(
  id: string,
  payload: Partial<BookPayload>
): Promise<Book | null> {
  const existing = await getBookById(id)
  if (!existing) return null
  const updated = { ...existing, ...payload }
  await booksDb.setItem(id, updated)
  return updated
}

export async function deleteBook(id: string): Promise<void> {
  await booksDb.removeItem(id)
}

export async function deleteBooksByAuthor(authorId: string): Promise<void> {
  const books = await getBooksByAuthor(authorId)
  await Promise.all(books.map((b) => deleteBook(b.id)))
}