import React, {
  Key,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { Empty, Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';

import './Completed.css';

const { Text } = Typography;

type CompletedProps = {
  data: DataNode[] | undefined,
  handleCheckTask: Function,
  handleTaskExpansion: Function,
};

const Completed = ({
  data,
  handleCheckTask,
  handleTaskExpansion,
}: CompletedProps) => {
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
    handleTaskExpansion(expandedKeysValue, 'completed');
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: any, event: any) => {
    const { node } = event;
    const { key: uncheckedKey } = node;
    const [primaryUncheckedKey] = uncheckedKey.split('-');

    handleCheckTask([primaryUncheckedKey], 'completed');
    setCheckedKeys(checkedKeysValue);
  };

  const renderTitle = (node: DataNode): ReactNode => {
    const { title } = node;

    return (
      <div className="completed-task-text">
        <Text>{title}</Text>
      </div>
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

export default Completed;
