import { Table, Button, Space, Popconfirm, Tag, Typography, Tooltip, Empty } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Author, AuthorPayload } from '@library/types'
import { AuthorModal } from '@library/ui'
import { useBooks } from '@/hooks/useBooks'
import { useAuthors } from '@/hooks/useAuthors'
import { useUIStore } from '@/store/uiStore'
import { useCreateAuthor, useDeleteAuthor, useUpdateAuthor } from '../../hooks/useAuthors'

const { Title } = Typography

export function AuthorTable() {
  const { data: books = [] } = useBooks()
  const { data: authors = [], isLoading } = useAuthors()

  const createAuthor = useCreateAuthor()
  const updateAuthor = useUpdateAuthor()
  const deleteAuthor = useDeleteAuthor()

  const { activeModal, modalMode, selectedId, openAuthorModal, closeModal } = useUIStore()

  const isOpen = activeModal === 'author'
  const selectedAuthor = selectedId ? authors.find((a) => a.id === selectedId) ?? null : null
  const isSaving = createAuthor.isPending || updateAuthor.isPending

  const handleSubmit = async (values: AuthorPayload) => {
    if (modalMode === 'create') await createAuthor.mutateAsync(values)
    else if (selectedId) await updateAuthor.mutateAsync({ id: selectedId, payload: values })
    closeModal()
  }

  const columns: ColumnsType<Author> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email?: string) => email 
  ? <span>{email}</span> 
  : <span style={{ color: '#bbb' }}>—</span>    
    },
    {
      title: 'Livros',
      dataIndex: 'books',
      key: 'books',
      align: 'center',
      render: (_, author) => {
        const count = books.filter((b) => b.author_id === author.id).length
        return count > 0 ? <Tag color="blue">{count}</Tag> : <span style={{ color: '#bbb' }}>0</span>
      },    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, author) => (
        <Space size="small">
          <Tooltip title="Visualizar">
            <Button type="text" size="small" icon={<EyeOutlined />}
              onClick={() => openAuthorModal('view', author.id)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={() => openAuthorModal('edit', author.id)} />
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Excluir autor"
              description="Tem certeza que deseja excluir este autor, todos os livros associados a este autor serão excluídos?"
              onConfirm={() => deleteAuthor.mutate(author.id)}
              okText="Excluir"
              okButtonProps={{ danger: true }}
              cancelText="Cancelar"
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Autores</Title>
          <span style={{ color: '#888', fontSize: 13 }}>
            {authors.length} {authors.length === 1 ? 'autor cadastrado' : 'autores cadastrados'}
          </span>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openAuthorModal('create')}>
          Novo Autor
        </Button>
      </div>

      <Table
        dataSource={authors}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        locale={{ emptyText: <Empty description="Nenhum autor cadastrado ainda" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total: ${total} autores` }}
      />

      <AuthorModal
        open={isOpen}
        mode={modalMode}
        author={selectedAuthor}
        booksCount={selectedAuthor ? books.filter((b) => b.author_id === selectedAuthor.id).length : 0}

        onClose={closeModal}
        onSubmit={handleSubmit}
        confirmLoading={isSaving}
      />
    </>
  )
}