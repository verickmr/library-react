import { Form, Input } from 'antd'
import type { FormInstance } from 'antd'
import type { AuthorPayload } from '@library/types'

export interface AuthorFormProps {
  form: FormInstance<AuthorPayload>
  disabled?: boolean
}

export function AuthorForm({ disabled }: AuthorFormProps) {
  return (
    <>
      <Form.Item
        name="name"
        label="Nome"
        rules={[{ required: true, message: 'Informe o nome' }]}
      >
        <Input placeholder="Ex: Machado de Assis" disabled={disabled} />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: 'email', message: 'Informe um email válido' }]}
      >
        <Input placeholder="Ex: machado@gmail.com" disabled={disabled} />
      </Form.Item>
    </>
  )
}