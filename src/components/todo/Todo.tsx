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
import Completed from './Completed/Completed';

import { SAMPLE_TO_DO } from '../../constants';

const { Title } = Typography;

const Todo = () => {
  const [todo, setTodo] = useState<DataNode[]>(SAMPLE_TO_DO);
  const [completed, setCompleted] = useState<DataNode[]>([]);
  const [taskCount, setTaskCount] = useState<number>(1);

  const findTaskByKeyPath = (keyPath: Array<String>, nodeList: DataNode[], key: String, mode: String, value: String, isPrimaryKey: boolean): DataNode[] => {
    const shiftedKey = Number(keyPath.shift());
    const index: number = isPrimaryKey
      ? nodeList.findIndex((e) => e.key === `${shiftedKey}`)
      : shiftedKey;
    const node = nodeList[index];

    if (node && node.children && keyPath.length > 0) {
      nodeList[index].children = findTaskByKeyPath(keyPath, node.children as DataNode[], key, mode, value, false);
    } else if (keyPath.length === 0) {
      if (mode === 'add') {
        const newKey = `${key}-${node && node.children ? node.children.length : 0}`;
        const newNode = { title: value, key: newKey, expanded: true, checked: false };
  
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
    const updatedTodo = [...todo, {
      checked: false,
      expanded: true,
      key: `${taskCount}`,
      title: '',
    }];

    setTaskCount(taskCount + 1);
    setTodo(updatedTodo);
  };

  const handleAddSubtask = (key: String) => {
    const updatedTodo = findTaskByKeyPath(key.split('-'), [...todo], key, 'add', '', true);

    setTodo(updatedTodo);
  };
  
  const handleEditTask = (key: String, value: String) => {
    const updatedTodo = findTaskByKeyPath(key.split('-'), [...todo], key, 'edit', value, true);

    setTodo(updatedTodo);
  };

  const handleCheckTask = (checkedKeys: string[], origin: string) => {
    const isTodo = origin === 'todotree';
    const data = isTodo ? todo : completed;

    const traverseTreeToUpdateCheckbox = (nodeList: DataNode[] | any): DataNode[] => {
      nodeList.forEach((task: DataNode | any, index: number) => {
        if (!isTodo) {
          nodeList[index].checked = false;
        }
        
        if (checkedKeys.includes(task.key)) {
          nodeList[index].checked = true;
        }

        if (task.children) {
          nodeList[index].children = traverseTreeToUpdateCheckbox(task.children);
        }
      });

      return nodeList;
    };

    // synchronize task checked status with their .checked attribute
    const updatedData = traverseTreeToUpdateCheckbox(data);
    const [parentTaskKey] = checkedKeys.filter((e) => e.length === 1);
    let newTodo;
    let newCompleted;

    // console.log('updatedData', updatedData);
    
    if (isTodo) {
      // transfer from todo to completed when parent task was checked
      newTodo = updatedData.filter((e) => e.key !== parentTaskKey);
      const completedTask = updatedData.filter((e) => e.key === parentTaskKey);
      newCompleted = [...completed, ...completedTask];
    } else {
      // transfer from completed to todo when parent task was unchecked
      newCompleted = updatedData.filter((e) => e.key !== parentTaskKey);
      const uncompletedTask: any = updatedData.filter((e) => e.key === parentTaskKey);
      if (uncompletedTask[0]) {
        uncompletedTask[0].checked = false;
      }
      newTodo = [...todo, ...uncompletedTask];
    }

    // console.log('newTodo', newTodo);
    // console.log('newCompleted', newCompleted);

    setTodo(newTodo);
    setCompleted(newCompleted as DataNode[]);
  };

  const handleTaskExpansion = (expandedKeys: string[], origin: string) => {
    const isTodo = origin === 'todotree';
    const data = isTodo ? todo : completed;

    const traverseTreeToUpdateExpansion = (nodeList: DataNode[] | any): DataNode[] => {
      nodeList.forEach((task: DataNode | any, index: number) => {
        if (!expandedKeys.includes(task.key)) {
          nodeList[index].expanded = false;
        }

        if (task.children) {
          nodeList[index].children = traverseTreeToUpdateExpansion(task.children);
        }
      });

      return nodeList;
    };

    // synchronize task expansion status with their .expanded attribute
    const updatedData = traverseTreeToUpdateExpansion(data);

    if (isTodo) {
      setTodo(updatedData);
    } else {
      setCompleted(updatedData);
    }
  };

  // console.log('todo:', todo);
  // console.log('completed:', completed);

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
        <Col span={24}>
          <TodoTree
            data={todo}
            handleAddSubtask={handleAddSubtask}
            handleCheckTask={handleCheckTask}
            handleEditTask={handleEditTask}
            handleTaskExpansion={handleTaskExpansion}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Title level={2}>
            Completed
          </Title>
        </Col>
        <Col span={24}>
          <Completed
            data={completed}
            handleCheckTask={handleCheckTask}
            handleTaskExpansion={handleTaskExpansion}
          />
        </Col>
      </Row>
    </>
  );
}

export default Todo;
