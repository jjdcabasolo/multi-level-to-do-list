import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Button,
  Col,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/lib/tree';

import './Todo.css';

import TodoTree from './TodoTree/TodoTree';

const { Title } = Typography;

const Todo = () => {
  const [todo, setTodo] = useState([] as DataNode[]);

  const handleAddTodo = () => {
    const updatedTodo = [...todo];
    const key = uuidv4();

    updatedTodo.push({ title: '', key });

    setTodo(updatedTodo);
  };

  return (
    <>
      <Row>
        <Col>
          <Title level={2}>
            Todo
          </Title>
        </Col>
        <Col>
          <Tooltip title="Add todo">
            <Button
              className="todo-add-todo"
              onClick={handleAddTodo}
              icon={<PlusOutlined />}
              shape="circle"
            />
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <TodoTree data={todo} />
        </Col>
      </Row>
    </>
  );
}

export default Todo;
