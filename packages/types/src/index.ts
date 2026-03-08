export interface Book {
  id: string
  name: string
  author_id: string
  pages?: number
  created_at: string
}

export interface Author {
  id: string
  name: string
  email?: string
  created_at: string
}

export type BookPayload = Omit<Book, 'id' | 'created_at'>
export type AuthorPayload = Omit<Author, 'id' | 'created_at'>