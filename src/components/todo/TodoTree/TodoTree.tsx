import React, {
  Key,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import moment from 'moment';

import {
  Col,
  DatePicker,
  Empty,
  Row,
  Tooltip,
  Tree,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/lib/tree';

import './TodoTree.css';

const { Paragraph, Text } = Typography;

type TodoTreeProps = {
  data: DataNode[] | undefined,
  handleAddDueDate: Function,
  handleAddSubtask: Function,
  handleCheckTask: Function,
  handleEditTask: Function,
  handleTaskExpansion: Function,
};

const TodoTree = ({
  data,
  handleAddDueDate,
  handleAddSubtask,
  handleCheckTask,
  handleEditTask,
  handleTaskExpansion,
}: TodoTreeProps) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const hasData = data && data.length > 0;

  // syncs UI states with the current fields on data
  useEffect(() => {
    let checkedKeysFromData: string[] = [];
    let expandedKeysFromData: string[] = [];

    const traverseTree = (nodeList: DataNode[]) => {
      nodeList.forEach((task: DataNode | any) => {
        if (task.checked) {
          checkedKeysFromData = [...checkedKeysFromData, task.key];
        }

        if (task.expanded) {
          expandedKeysFromData = [...expandedKeysFromData, task.key];
        }

        if (task.children) {
          traverseTree(task.children);
        }
      });
    };

    if (data) {
      traverseTree(data);
      setCheckedKeys(checkedKeysFromData);
      setExpandedKeys(expandedKeysFromData);
    }
  }, [data]);

  const onExpand = (expandedKeysValue: Key[]) => {
    handleTaskExpansion(expandedKeysValue, 'todotree');
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: Key[] | any) => {
    handleCheckTask(checkedKeysValue, 'todotree');
    setCheckedKeys(checkedKeysValue);
  };

  const renderTitle = (node: DataNode): ReactNode => {
    const { key, title, dueDate } = node as any;

    const handleTitleEdit = (value: String) => {
      handleEditTask(key, value);
    };

    const handleAddSubtaskClick = () => {
      handleAddSubtask(key);
    };

    const handleAddDueDateClick = (date: any) => {
      handleAddDueDate(key, date ? moment(date).format('YYYY-MM-DD') : '');
    };

    const renderDueDate = () => {
      let text: string = '';

      if (moment(dueDate).isBefore(moment())) {
        text = 'Overdue';
      }

      if (moment(dueDate).isSame(moment(), 'day')) {
        text = 'Due today';
      }

      return (
        <>
          {text.length > 0 && (
            <Col>
              <div className="todotree-overdue">
                {text}
              </div>
            </Col>
          )}
          <Col>
            <Text>
              {`Due ${moment(dueDate).format('D MMM')}`}
            </Text>
          </Col>
        </>
      );
    };

    return (
      <Row>
        <Col>
          <Paragraph
            className="todotree-editable-text"
            editable={{
              autoSize: { maxRows: 3, minRows: 1 },
              onChange: handleTitleEdit,
            }}
            >
            {title}
          </Paragraph>
        </Col>
        <Col>
          <Tooltip title="Add subtask">
            <PlusOutlined onClick={handleAddSubtaskClick} />
          </Tooltip>
        </Col>
        <Col>
          <DatePicker
            bordered={false}
            className="todotree-date-picker"
            defaultValue={dueDate && dueDate.length > 0 ? moment(dueDate) : undefined}
            onChange={handleAddDueDateClick}
          />
        </Col>
        {dueDate && dueDate.length > 0 && renderDueDate()}
      </Row>
    );
  };

  return (
    <div className={`todotree-container ${hasData ? '' : 'todotree-container-center-content'}`}>
      {hasData
        ? (
          <Tree
            autoExpandParent={autoExpandParent}
            checkable
            checkedKeys={checkedKeys}
            className="todotree"
            expandedKeys={expandedKeys}
            onCheck={onCheck}
            onExpand={onExpand}
            titleRender={renderTitle}
            treeData={data}
          />
        )
        : <Empty />}
    </div>
  );
};

export default TodoTree;
