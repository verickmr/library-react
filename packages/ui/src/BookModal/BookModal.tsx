import { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Select, Descriptions, Tag } from 'antd'
import dayjs from 'dayjs'
import type { Book, BookPayload, Author } from '@library/types'

export interface BookModalProps {
  open: boolean
  mode: 'create' | 'view' | 'edit'
  book?: Book | null
  authors: Author[]
  onClose: () => void
  onSubmit?: (values: BookPayload) => Promise<void>
  confirmLoading?: boolean
}

export function BookModal({ open, mode, book, authors, onClose, onSubmit, confirmLoading }: BookModalProps) {
  const [form] = Form.useForm<BookPayload>()

  useEffect(() => {
    if (!open) return
    if (mode !== 'create' && book) {
      form.setFieldsValue({ name: book.name, author_id: book.author_id, pages: book.pages })
    } else {
      form.resetFields()
    }
  }, [open, mode, book, form])

  const isReadOnly = mode === 'view'
  const titles = { create: 'Adicionar Livro', edit: 'Editar Livro', view: 'Detalhes do Livro' }
  const author = authors.find((a) => a.id === book?.author_id)

  const handleOk = async () => {
    if (isReadOnly) { onClose(); return }
    const values = await form.validateFields()
    await onSubmit?.(values)
  }

  return (
    <Modal
      open={open}
      title={titles[mode]}
      onCancel={onClose}
      onOk={isReadOnly ? onClose : handleOk}
      okText={isReadOnly ? 'Fechar' : mode === 'create' ? 'Criar' : 'Salvar'}
      cancelButtonProps={isReadOnly ? { style: { display: 'none' } } : undefined}
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
          <Form.Item name="author_id" label="Autor" rules={[{ required: true, message: 'Selecione um autor' }]}>
            <Select
              placeholder="Selecione um autor"
              showSearch
              optionFilterProp="label"
              options={authors.map((a) => ({ value: a.id, label: a.name }))}
            />
          </Form.Item>
          <Form.Item name="pages" label="Páginas">
            <InputNumber min={1} max={99999} placeholder="Ex: 432" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}
