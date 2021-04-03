import React, {
  Key,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import {
  Col,
  Empty,
  Row,
  Tooltip,
  Tree,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/lib/tree';

import './TodoTree.css';

const { Paragraph } = Typography;

type TodoTreeProps = {
  data: DataNode[] | undefined,
  handleAddSubtask: Function,
  handleCheckTask: Function,
  handleEditTask: Function,
  handleTaskExpansion: Function,
};

const TodoTree = ({
  data,
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
    const { key, title } = node;

    const handleTitleEdit = (value: String) => {
      handleEditTask(key, value);
    };

    const handleAddClick = () => {
      handleAddSubtask(key);
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
            <PlusOutlined onClick={handleAddClick} />
          </Tooltip>
        </Col>
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
