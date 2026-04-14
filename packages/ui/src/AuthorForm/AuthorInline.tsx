import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Form } from "antd";
import { AuthorForm } from './AuthorForm'
import type { FormInstance } from 'antd'
import type { AuthorPayload } from '@library/types'

interface AuthorInlineProps {
  authorForm: FormInstance<AuthorPayload>
  handleCancelInline: () => void
  handleCreateAuthorInline: () => Promise<void>
  isCreatingAuthor?: boolean
}

export function AuthorInline({
  authorForm,
  handleCancelInline,
  handleCreateAuthorInline,
  isCreatingAuthor,
}: AuthorInlineProps) {
  return (
    <>
      <Divider style={{ margin: '8px 0 16px' }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          Novo Autor
        </span>

        <Button
          type="text"
          size="small"
          icon={<ArrowLeftOutlined />}
          onClick={handleCancelInline}
        >
          Voltar
        </Button>
      </div>

      <Form form={authorForm} layout="vertical">
        <AuthorForm form={authorForm} />
      </Form>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          size="small"
          onClick={handleCreateAuthorInline}
          loading={isCreatingAuthor}
        >
          Salvar Autor
        </Button>
      </div>

      <Divider style={{ margin: '16px 0 8px' }} />
    </>
  )
}