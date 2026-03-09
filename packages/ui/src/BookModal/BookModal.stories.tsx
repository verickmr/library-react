import type { Meta, StoryObj } from '@storybook/react'
import { BookModal } from './BookModal'

const authors = [
  { id: '1', name: 'Machado de Assis', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'Clarice Lispector', created_at: '2024-01-01T00:00:00.000Z' },
]

const book = {
  id: '1',
  name: 'Dom Casmurro',
  author_id: '1',
  pages: 256,
  created_at: '2024-01-01T00:00:00.000Z',
}

const meta: Meta<typeof BookModal> = {
  title: 'UI/BookModal',
  component: BookModal,
  args: {
    open: true,
    authors,
    onClose: () => {},
    onSubmit: async () => {},
    confirmLoading: false,
  },
}

export default meta
type Story = StoryObj<typeof BookModal>

export const Create: Story = {
  args: { mode: 'create' },
}

export const View: Story = {
  args: { mode: 'view', book },
}

export const Edit: Story = {
  args: { mode: 'edit', book },
}

export const Loading: Story = {
  args: { mode: 'edit', book, confirmLoading: true },
}