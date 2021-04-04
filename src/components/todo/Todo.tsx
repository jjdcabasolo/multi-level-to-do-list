import React, { useState, useEffect } from 'react';

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

const { Title } = Typography;

const Todo = () => {
  const [todo, setTodo] = useState<DataNode[]>([]);
  const [completed, setCompleted] = useState<DataNode[]>([]);
  const [taskCount, setTaskCount] = useState<number>(1);

  // read data from local storage if there's a saved todo/completed JSON string
  useEffect(() => {
    const todoFromLocalStorage = localStorage.getItem('todo');
    const completedFromLocalStorage = localStorage.getItem('completed');
    let parsedTodo: DataNode[] = [];
    let parsedCompleted: DataNode[] = [];
    let primaryKeys: number[] = [];

    if (todoFromLocalStorage && todoFromLocalStorage.length > 0) {
      parsedTodo = JSON.parse(todoFromLocalStorage);
      setTodo(parsedTodo);
    }

    if (completedFromLocalStorage && completedFromLocalStorage.length > 0) {
      parsedCompleted = JSON.parse(completedFromLocalStorage);
      setCompleted(parsedCompleted);
    }

    if (parsedTodo.length > 0) {
      primaryKeys = [...primaryKeys, ...parsedTodo.map((e) => e.key as number)];
    }

    if (parsedCompleted.length > 0) {
      primaryKeys = [...primaryKeys, ...parsedCompleted.map((e) => e.key as number)];
    }

    const highestIndex = primaryKeys.length > 0
      ? primaryKeys.reduce((a, b) => Math.max(a, b)) + 1
      : 1;
    
    setTaskCount(highestIndex);
  }, []);

  // for data persistence - write on local storage every change on list was made
  const writeToLocalStorage = (todoToWrite: DataNode[] = todo, completedToWrite: DataNode[] = completed) => {
    localStorage.setItem('todo', JSON.stringify(todoToWrite));
    localStorage.setItem('completed', JSON.stringify(completedToWrite));
  };

  // recursion to locate and edit the specific task using the key path (format: 1-0-0)
  // where first number is the unique key, and the subsequent numbers are the 
  // index in the children array
  const findTaskByKeyPath = (keyPath: Array<String>, nodeList: DataNode[] | any, key: String, mode: String, value: String, isPrimaryKey: boolean): DataNode[] => {
    const shiftedKey = Number(keyPath.shift());
    // primary key (first number in key path) does not mean it is the index in the array
    // so it findIndex() was used to get it. for the subsequent keys in the path, it is
    // now using the index in the children array.
    const index: number = isPrimaryKey
      ? nodeList.findIndex((e: DataNode) => e.key === `${shiftedKey}`)
      : shiftedKey;
    const node = nodeList[index];

    if (node && node.children && keyPath.length > 0) {
      nodeList[index].children = findTaskByKeyPath(keyPath, node.children as DataNode[], key, mode, value, false);
    } else if (keyPath.length === 0) {
      if (mode === 'addSubtask') {
        const newKey = `${key}-${node && node.children ? node.children.length : 0}`;
        const newNode = {
          checked: false,
          dueDate: '',
          expanded: true,
          key: newKey,
          title: value,
        };
  
        nodeList[index].children = node && node.children
          ? [...node.children, newNode]
          : [newNode];
      } else if (mode === 'edit') {
        nodeList[index].title = value;
      } else if (mode === 'addDueDate') {
        nodeList[index].dueDate = value;
      }

      return nodeList;
    }

    return nodeList;
  };

  // add main task
  // triggered when the plus icon beside the Todo header was clicked
  const handleAddTask = () => {
    const updatedTodo = [...todo, {
      checked: false,
      dueDate: '',
      expanded: true,
      key: `${taskCount}`,
      title: '',
    }];

    setTaskCount(taskCount + 1);
    setTodo(updatedTodo);

    writeToLocalStorage(updatedTodo);
  };

  // add subtask from a task
  // triggered when the plus icon on the right side of task text was clicked
  const handleAddSubtask = (key: String) => {
    const updatedTodo = findTaskByKeyPath(key.split('-'), [...todo], key, 'addSubtask', '', true);

    setTodo(updatedTodo);

    writeToLocalStorage(updatedTodo);
  };
  
  // sync data's .title on <Paragraph />  value change
  // triggered when a value has been set on <Paragraph /> on todo tree
  const handleEditTask = (key: String, value: String) => {
    const updatedTodo = findTaskByKeyPath(key.split('-'), [...todo], key, 'edit', value, true);

    setTodo(updatedTodo);

    writeToLocalStorage(updatedTodo);
  };

  // sync data's .dueDate on <DatePicker /> value change
  // triggered when a date has been set on date picker on todo tree
  const handleAddDueDate = (key: String, dueDate: String) => {
    const updatedTodo = findTaskByKeyPath(key.split('-'), [...todo], key, 'addDueDate', dueDate, true);

    setTodo(updatedTodo);

    writeToLocalStorage(updatedTodo);
  };

  // sync task checked status with their .checked attribute
  // triggered when checkbox was clicked on todo tree
  const handleCheckTask = (checkedKeys: string[], origin: string) => {
    const isTodo = origin === 'todotree';
    const data = isTodo ? todo : completed;

    const traverseTreeToUpdateCheckbox = (nodeList: DataNode[] | any, forceChildrenUpdate: boolean): DataNode[] => {
      nodeList.forEach((task: DataNode | any, index: number) => {
        if (checkedKeys.includes(task.key) || (forceChildrenUpdate && !isTodo)) {
          nodeList[index].checked = isTodo;
        }

        if (task.children) {
          nodeList[index].children = traverseTreeToUpdateCheckbox(task.children, true);
        }
      });

      return nodeList;
    };

    // synchronize task checked status with their .checked attribute
    const updatedData = traverseTreeToUpdateCheckbox(data, false);
    const [parentTaskKey] = checkedKeys.filter((e) => e.length === 1);
    let newTodo;
    let newCompleted;
    
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

    setTodo(newTodo);
    setCompleted(newCompleted as DataNode[]);

    writeToLocalStorage(newTodo, newCompleted);
  };

  // sync task expansion status with their .expanded attribute
  // triggered when expansion icon was clicked on todo tree
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
      writeToLocalStorage(updatedData);
    } else {
      setCompleted(updatedData);
      writeToLocalStorage(todo, updatedData);
    }
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
        <Col span={24}>
          <TodoTree
            data={todo}
            handleAddDueDate={handleAddDueDate}
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
