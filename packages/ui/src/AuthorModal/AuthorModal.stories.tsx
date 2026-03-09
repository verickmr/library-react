import type { Meta, StoryObj } from '@storybook/react'
import { AuthorModal } from './AuthorModal'

const author = {
  id: '1',
  name: 'Machado de Assis',
  email: 'machado@lit.br',
  created_at: '2024-01-01T00:00:00.000Z',
}

const meta: Meta<typeof AuthorModal> = {
  title: 'UI/AuthorModal',
  component: AuthorModal,
  args: {
    open: true,
    booksCount: 3,
    onClose: () => {},
    onSubmit: async () => {},
    confirmLoading: false,
  },
}

export default meta
type Story = StoryObj<typeof AuthorModal>

export const Create: Story = {
  args: { mode: 'create' },
}

export const View: Story = {
  args: { mode: 'view', author },
}

export const Edit: Story = {
  args: { mode: 'edit', author },
}

export const NoBooks: Story = {
  args: { mode: 'view', author, booksCount: 0 },
}