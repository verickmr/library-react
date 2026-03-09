import { Layout, Menu, Typography } from 'antd'
import { BookOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const { Sider, Content } = Layout
const { Title, Text } = Typography

const menuItems = [
  { key: '/books', icon: <BookOutlined />, label: 'Livros' },
  { key: '/authors', icon: <UserOutlined />, label: 'Autores' },
]

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ position: 'fixed', height: '100vh', left: 0, top: 0 }}>
        <div style={{ padding: '32px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            Library
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>
            Gerenciador de Livros
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', background: 'transparent' }}
        />
      </Sider>
      <Layout style={{ marginLeft: 220 }}>
        <Content style={{ padding: '40px 48px', minHeight: '100vh', background: '#f7f6f3', width: '100%' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}