import { useEffect, useMemo, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, Descriptions, Tag, Button, Divider, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Book, BookPayload, Author, AuthorPayload } from '@library/types'
import { AuthorInline } from '../AuthorForm/AuthorInline'

export interface BookModalProps {
open: boolean
mode: 'create' | 'view' | 'edit'
book?: Book | null
authors: Author[]
onClose: () => void
onSubmit?: (values: BookPayload) => Promise<void>
  onCreateAuthor?: (values: AuthorPayload) => Promise<Author>
confirmLoading?: boolean
  isCreatingAuthor?: boolean
}

export function BookModal({
  open,
  mode,
  book,
  authors,
  onClose,
  onSubmit,
  onCreateAuthor,
  confirmLoading,
  isCreatingAuthor,
}: BookModalProps) {
const [form] = Form.useForm<BookPayload>()
  const [authorForm] = Form.useForm<AuthorPayload>()
  const [isInlineAuthorMode, setIsInlineAuthorMode] = useState(false)

useEffect(() => {
if (!open) return
if (mode !== 'create' && book) {
form.setFieldsValue({ name: book.name, author_id: book.author_id, pages: book.pages })
} else {
form.resetFields()
}
}, [open, mode, book, form])

  useEffect(() => {
    if (!open) {
      setIsInlineAuthorMode(false)
      authorForm.resetFields()
    }
  }, [open])

const isReadOnly = mode === 'view'
const titles = { create: 'Adicionar Livro', edit: 'Editar Livro', view: 'Detalhes do Livro' }
const author = useMemo(
  () => authors.find((a) => a.id === book?.author_id),
  [authors, book?.author_id]
)
const handleOk = async () => {
if (isReadOnly) { onClose(); return }
const values = await form.validateFields()
await onSubmit?.(values)
}

  const handleCreateAuthorInline = async () => {
    try {
  const values = await authorForm.validateFields()
  if (!onCreateAuthor) return

  const newAuthor = await onCreateAuthor(values)

  form.setFieldValue('author_id', newAuthor.id)
  setIsInlineAuthorMode(false)
  authorForm.resetFields()

  message.success('Autor criado com sucesso')
} catch (error) {
  const msg = error instanceof Error ? error.message : 'Erro ao criar autor'
  message.error(msg)
}
  }

  const handleCancelInline = () => {
    setIsInlineAuthorMode(false)
    authorForm.resetFields()
  }

return (
<Modal
open={open}
title={titles[mode]}
onCancel={onClose}
onOk={isReadOnly ? onClose : handleOk}
okText={isReadOnly ? 'Fechar' : mode === 'create' ? 'Criar' : 'Salvar'}
cancelButtonProps={isReadOnly ? { style: { display: 'none' } } : undefined}
      okButtonProps={isInlineAuthorMode ? { style: { display: 'none' } } : undefined}
confirmLoading={confirmLoading}
destroyOnClose
width={520}
>
{isReadOnly && book ? (
<Descriptions column={1} bordered size="small">
<Descriptions.Item label="Título">{book.name}</Descriptions.Item>
<Descriptions.Item label="Autor">
{author ? <Tag color="geekblue">{author.name}</Tag> : <Tag color="red">Autor removido</Tag>}
</Descriptions.Item>
<Descriptions.Item label="Páginas">{book.pages ?? '—'}</Descriptions.Item>
<Descriptions.Item label="Criado em">
{dayjs(book.created_at).format('DD/MM/YYYY [às] HH:mm')}
</Descriptions.Item>
</Descriptions>
) : (
<Form form={form} layout="vertical" style={{ marginTop: 16 }}>
<Form.Item name="name" label="Título" rules={[{ required: true, message: 'Informe o título' }]}>
<Input placeholder="Ex: Dom Casmurro" />
</Form.Item>

          {isInlineAuthorMode ? (
            <AuthorInline
              authorForm={authorForm}
              handleCancelInline={handleCancelInline}
              handleCreateAuthorInline={handleCreateAuthorInline}
              isCreatingAuthor={isCreatingAuthor}
/>
          ) : (
            <Form.Item
              name="author_id"
              label="Autor"
              rules={[{ required: true, message: 'Selecione um autor' }]}
            >
              <Select
                placeholder="Selecione um autor"
                showSearch
                optionFilterProp="label"
                options={authors.map((a) => ({ value: a.id, label: a.name }))}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      style={{ width: '100%' }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsInlineAuthorMode(true)
                      }}>
                      Criar novo autor
                    </Button>
                  </>
                )}
              />
            </Form.Item>
          )}

<Form.Item name="pages" label="Páginas">
<InputNumber min={1} max={99999} placeholder="Ex: 432" style={{ width: '100%' }} />
</Form.Item>
</Form>
)}
</Modal>
)
}