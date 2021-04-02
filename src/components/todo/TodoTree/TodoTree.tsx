import React, { useState, Key, ReactNode } from 'react';

import { Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';

import './TodoTree.css';

const { Paragraph } = Typography;

type TodoTreeProps = {
  data: DataNode[] | undefined,
};

const TodoTree = ({ data }: TodoTreeProps) => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // Type '(checked: Key[]) => void'
  // is not assignable to type
  // '(checked: Key[] | { checked: Key[]; halfChecked: Key[]; }, info: CheckInfo) => void'.

  const onCheck = (checkedKeysValue: any) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const renderTitle = (node: DataNode): ReactNode => {
    const { title } = node;

    const handleTitleEdit = () => {
      console.log('edit this shit');
    };

    return (
      <Paragraph editable={{ onChange: handleTitleEdit }}>
        {title}
      </Paragraph>
    );
  };

  return (
    <Tree
      autoExpandParent={autoExpandParent}
      checkable
      checkedKeys={checkedKeys}
      expandedKeys={expandedKeys}
      onCheck={onCheck}
      onExpand={onExpand}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={data}
      titleRender={renderTitle}
      className="todotree"
    />
  );
};

export default TodoTree;
