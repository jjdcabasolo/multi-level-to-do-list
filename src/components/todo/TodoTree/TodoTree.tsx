import React, { useState, Key, ReactNode } from 'react';

import { Tooltip, Tree, Typography, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataNode } from 'antd/lib/tree';

import './TodoTree.css';

const { Paragraph } = Typography;

type TodoTreeProps = {
  data: DataNode[] | undefined,
  handleEditTask: Function,
  handleAddSubtask: Function,
};

const TodoTree = ({
  data,
  handleAddSubtask,
  handleEditTask,
}: TodoTreeProps) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(['0-0-0', '0-0-1']);
  // const [checkedKeys, setCheckedKeys] = useState<Key[]>(['0-0-0']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // Type '(checked: Key[]) => void'
  // is not assignable to type
  // '(checked: Key[] | { checked: Key[]; halfChecked: Key[]; }, info: CheckInfo) => void'.

  // const onCheck = (checkedKeysValue: any) => {
  //   console.log('onCheck', checkedKeysValue);
  //   setCheckedKeys(checkedKeysValue);
  // };

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
    <Tree
      autoExpandParent={autoExpandParent}
      checkable
      className="todotree"
      expandedKeys={expandedKeys}
      // onCheck={onCheck}
      onExpand={onExpand}
      titleRender={renderTitle}
      treeData={data}
    />
  );
};

export default TodoTree;
