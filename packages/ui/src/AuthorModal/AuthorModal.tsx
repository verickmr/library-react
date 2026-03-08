import { useEffect } from 'react'
import { Modal, Form, Input, Descriptions, Tag } from 'antd'
import type { Author, AuthorPayload } from '@library/types'

export interface AuthorModalProps {
  open: boolean
  mode: 'create' | 'view' | 'edit'
  author?: Author | null
  booksCount: number
  onClose: () => void
  onSubmit?: (values: AuthorPayload) => Promise<void>
  confirmLoading?: boolean
}

export function AuthorModal({ open, mode, author, booksCount, onClose, onSubmit, confirmLoading }: AuthorModalProps) {
  const [form] = Form.useForm<AuthorPayload>()

  useEffect(() => {
    if (!open) return
    if (mode !== 'create' && author) {
      form.setFieldsValue({ name: author.name, email: author.email })
    } else {
      form.resetFields()
    }
  }, [open, mode, author, form])

  const isReadOnly = mode === 'view'
  const titles = { create: 'Adicionar Autor', edit: 'Editar Autor', view: 'Detalhes do Autor' }

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
      {isReadOnly && author ? (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Nome">{author.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{author.email ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Livros">{booksCount}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
            <Input placeholder="Ex: Machado de Assis" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Informe um email válido' }]}
          >
            <Input placeholder="Ex: machado@gmail.com" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}
