import React, { useState } from 'react';

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

  const findKey = (keyPath: Array<String>, nodeList: DataNode[], key: String, mode: String, value: String): DataNode[] => {
    const index: number = Number(keyPath.shift());
    const node = nodeList[index];

    if (node && node.children && keyPath.length > 0) {
      nodeList[index].children = findKey(keyPath, node.children as DataNode[], key, mode, value);
    } else if (keyPath.length === 0) {
      if (mode === 'add') {
        const newKey = `${key}-${node && node.children ? node.children.length : 0}`;
        const newNode = { title: value, key: newKey };
  
        nodeList[index].children = node && node.children
          ? [...node.children, newNode]
          : [newNode];
      } else if (mode === 'edit') {
        nodeList[index].title = value;
      }

      return nodeList;
    }

    return nodeList;
  };

  const handleAddTask = () => {
    const key = `${todo.length}`;
    const updatedTodo = [...todo, { title: '', key }];

    setTodo(updatedTodo);
  };

  const handleAddSubtask = (key: String) => {
    const updatedTodo = findKey(key.split('-'), [...todo], key, 'add', '');

    setTodo(updatedTodo);
  };
  
  const handleEditTask = (key: String, value: String) => {
    const updatedTodo = findKey(key.split('-'), [...todo], key, 'edit', value);

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
          <Tooltip title="Add task">
            <Button
              className="todo-add-todo"
              onClick={handleAddTask}
              icon={<PlusOutlined />}
              shape="circle"
            />
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <TodoTree
            data={todo}
            handleAddSubtask={handleAddSubtask}
            handleEditTask={handleEditTask}
          />
        </Col>
      </Row>
    </>
  );
}

export default Todo;
