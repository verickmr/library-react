import { Layout, Menu, Typography, Drawer, Button } from 'antd'
import { BookOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import type { ReactNode } from 'react'

const { Sider, Content } = Layout
const { Title, Text } = Typography

const menuItems = [
  { key: '/books', icon: <BookOutlined />, label: 'Livros' },
  { key: '/authors', icon: <UserOutlined />, label: 'Autores' },
]

const SidebarContent = ({ onNavigate }: { onNavigate: (key: string) => void }) => {
  const location = useLocation()
  return (
    <>
      <div style={{ padding: '32px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>Library</Title>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase' }}>
          Gerenciador de Livros
        </Text>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => onNavigate(key)}
        style={{ border: 'none', background: 'transparent' }}
      />
    </>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNavigate = (key: string) => {
    navigate(key)
    setDrawerOpen(false)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <Sider
        width={220}
        breakpoint="md"
        collapsedWidth={0}
        trigger={null}
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 }}
      >
        <SidebarContent onNavigate={handleNavigate} />
      </Sider>

      {/* Mobile drawer */}
      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ body: { padding: 0, background: '#001529' }, header: { display: 'none' } }}
        width={220}
      >
        <SidebarContent onNavigate={handleNavigate} />
      </Drawer>

      <Layout style={{ marginLeft: 0 }} className="main-layout">
        {/* Mobile header */}
        <div className="mobile-header">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{ color: '#fff' }}
          />
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Library</Title>
        </div>

        <Content style={{ padding: '40px 48px', minHeight: '100vh', background: '#f7f6f3' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}