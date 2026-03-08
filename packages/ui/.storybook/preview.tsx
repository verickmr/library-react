import type { Preview } from '@storybook/react'
import { ConfigProvider, App as AntApp } from 'antd'
import React from 'react'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfigProvider theme={{ token: { colorPrimary: '#2d4739' } }}>
        <AntApp>
          <div style={{ padding: 24 }}>
            <Story />
          </div>
        </AntApp>
      </ConfigProvider>
    ),
  ],
}

export default preview