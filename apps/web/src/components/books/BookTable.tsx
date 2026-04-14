import { Table, Button, Space, Popconfirm, Tag, Typography, Tooltip, Empty, type Breakpoint } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import type { AuthorPayload, Book, BookPayload } from '@library/types'
import { BookModal } from '@library/ui'
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '@/hooks/useBooks'
import { useAuthors, useCreateAuthor } from '@/hooks/useAuthors'
import { useUIStore } from '@/store/uiStore'

const { Title } = Typography

export function BookTable() {
  const { data: books = [], isLoading } = useBooks()
  const { data: authors = [] } = useAuthors()

  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()
  const createAuthor = useCreateAuthor()

  const { activeModal, modalMode, selectedId, openBookModal, closeModal } = useUIStore()

  const isOpen = activeModal === 'book'
  const selectedBook = selectedId ? books.find((b) => b.id === selectedId) ?? null : null
  const isSaving = createBook.isPending || updateBook.isPending

  const handleSubmit = async (values: BookPayload) => {
    if (modalMode === 'create') await createBook.mutateAsync(values)
    else if (selectedId) await updateBook.mutateAsync({ id: selectedId, payload: values })
    closeModal()
  }

  const handleCreateAuthor = async (values: AuthorPayload) => {
    return await createAuthor.mutateAsync(values)
  }

  const columns: ColumnsType<Book> = [
    {
      title: 'Título',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: 'Autor',
      dataIndex: 'author_id',
      key: 'author_id',
      render: (authorId: string) => {
        const author = authors.find((a) => a.id === authorId)
        return author
          ? <Tag color="geekblue">{author.name}</Tag>
          : <Tag color="red">Autor removido</Tag>
      },
    },
    {
      title: 'Páginas',
      dataIndex: 'pages',
      key: 'pages',
      align: 'center',
      width: 100,
      responsive: ['md'] as Breakpoint[],
      sorter: (a, b) => (a.pages ?? 0) - (b.pages ?? 0),
      render: (pages?: number) => pages ?? <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Criado em',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      responsive: ['md'] as Breakpoint[],
      defaultSortOrder: 'descend',
      sorter: (a, b) => dayjs(a.created_at).diff(dayjs(b.created_at)),
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, book) => (
        <Space size="small">
          <Tooltip title="Visualizar">
            <Button type="text" size="small" icon={<EyeOutlined />}
              onClick={() => openBookModal('view', book.id)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={() => openBookModal('edit', book.id)} />
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Excluir livro"
              description="Tem certeza que deseja excluir este livro?"
              onConfirm={() => deleteBook.mutate(book.id)}
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
          <Title level={2} style={{ margin: 0 }}>Livros</Title>
          <span style={{ color: '#888', fontSize: 13 }}>
            {books.length} {books.length === 1 ? 'livro cadastrado' : 'livros cadastrados'}
          </span>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openBookModal('create')}>
          Novo Livro
        </Button>
      </div>

      <Table
        dataSource={books}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="Nenhum livro cadastrado ainda" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total: ${total} livros` }}
      />

      <BookModal
        open={isOpen}
        mode={modalMode}
        book={selectedBook}
        authors={authors}
        onCreateAuthor={handleCreateAuthor}
        onClose={closeModal}
        onSubmit={handleSubmit}
        confirmLoading={isSaving}
        isCreatingAuthor={createAuthor.isPending}
      />
    </>
  )
}