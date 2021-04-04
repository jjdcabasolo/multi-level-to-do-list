import React from 'react';

import { Layout, Typography } from 'antd';

import './App.css';

import Todo from './components/todo/Todo';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => (
  <Layout>
    <Header className="app-header">
      <Title>Multi-level To Do List</Title>
    </Header>
    <Content className="app-content">
      <Todo />
    </Content>
  </Layout>
);

export default App;
