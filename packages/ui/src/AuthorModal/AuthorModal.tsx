import { useEffect } from 'react'
import { Modal, Form, Descriptions } from 'antd'
import type { Author, AuthorPayload } from '@library/types'
import { AuthorForm } from '../AuthorForm/AuthorForm'

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
          <AuthorForm form={form} />
</Form>
)}
</Modal>
)
}