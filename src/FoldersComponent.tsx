import "./styles.css";
import { Button, Tree, TreeSelect, Input } from "antd";
import React, { useState, useCallback, useMemo, Key } from "react";
import FolderTreeNode from "./FolderTreeNode";
import { v4 } from "uuid";
import { treeData } from "./data";
import "./FoldersComponent.less";
import { DataNode, EventDataNode } from "antd/lib/tree";

const { Search } = Input;
const { DirectoryTree } = Tree;

export type FolderNode = {
  key: string;
  title: string;
  value?: string;
  users: number | string[];
  draft?: number;
  children?: Array<FolderNode>;
  originalTitle?: string;
};

export default function FoldersComponent() {
  const [data, setData] = useState<Array<FolderNode>>(treeData);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");

  const onSearchChange = useCallback((e: any) => {
    const { value } = e.target;
    setSearchValue(value);
  }, []);

  const onDrop = useCallback(
    (info: any) => {
      // prevent drag a draft folder
      if (info.dragNode.draft === 1) {
        return;
      }
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const updateNodeData = (
        data: FolderNode[],
        key: string,
        callback: Function,
        visible: number | string[] | null
      ) => {
        let parentVis = visible;
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data, parentVis);
          }
          if (data[i].children) {
            updateNodeData(
              data[i].children || [],
              key,
              callback,
              data[i].users
            );
          }
        }
      };
      const clonedData = [...data];

      let dragObj: any;
      updateNodeData(
        clonedData,
        dragKey,
        (item: any, index: number, arr: Array<FolderNode>) => {
          arr.splice(index, 1);
          dragObj = item;
        },
        null
      );

      if (!info.dropToGap) {
        updateNodeData(
          clonedData,
          dropKey,
          (item: any) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
          },
          null
        );
      } else if (
        (info.node.props.children || []).length > 0 &&
        info.node.props.expanded &&
        dropPosition === 1
      ) {
        updateNodeData(
          clonedData,
          dropKey,
          (item: any) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
          },
          null
        );
      } else {
        let ar: Array<FolderNode> = [];
        let i = 0;
        updateNodeData(
          clonedData,
          dropKey,
          (item: any, index: number, arr: Array<FolderNode>) => {
            ar = arr;
            i = index;
          },
          null
        );
        const temp: FolderNode = { ...dragObj };
        if (dropPosition === -1) {
          ar.splice(i, 0, temp);
        } else {
          ar.splice(i + 1, 0, temp);
        }
      }

      // let parentVis
      const loopChildren = (data: any, callback: any) => {
        for (let i = 0; i < data.length; i++) {
          callback(data[i]);
          if (data[i].children) {
            loopChildren(data[i].children, callback);
          }
        }
      };

      updateNodeData(
        clonedData,
        dragKey,
        (item: any, index: number, arr: Array<FolderNode>, parentVis: any) => {
          if (!parentVis) {
            return;
          }
          item.users = parentVis;
          if (item.children?.length > 0) {
            loopChildren(item.children, (childItem: any) => {
              childItem.users = parentVis;
            });
          }
        },
        null
      );

      setData(clonedData);
    },
    [data]
  );

  const addItem = useCallback(() => {
    const id = v4();
    const newData = {
      title: "",
      value: id,
      key: id,
      users: -1,
      draft: 1
    };
    setData([newData, ...data]);
  }, [data]);
  const searchData = useMemo(() => {
    const getSearchData = (dataArr: any) =>
      dataArr.map((item: FolderNode) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="search-highlight">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        return {
          ...item,
          title,
          originalTitle: item.title,
          key: item.key,
          children: getSearchData(item.children || [])
        };
      });
    return getSearchData(data);
  }, [data, searchValue]);

  const onSelectFolder = (
    selectedKeys: Key[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => {
    const node = { ...info.node, users: -1 } as FolderNode;
    if (node.draft !== 1) {
      setSelectedFolderName(node.originalTitle || "");
      setIsSelectOpen(false);
    }
  };

  const renderFolderNode = (nodeData: any) => {
    return <FolderTreeNode setData={setData} data={data} nodeData={nodeData} />;
  };
  const dropdownRender = () => (
    <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <div>
        <Search
          placeholder="Search"
          onChange={onSearchChange}
          className="search-box"
        />
        <Button type="link" onClick={addItem}>
          Add New Folder
        </Button>
      </div>

      <DirectoryTree
        draggable
        blockNode
        onDrop={onDrop}
        className="draggable-tree"
        treeData={searchData}
        titleRender={renderFolderNode}
        onSelect={onSelectFolder}
      />
    </div>
  );
  const onContainerClick = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  return (
    <div className="App">
      <div onClick={onContainerClick}>
        <h1> Copy Data to Folder</h1>
        <TreeSelect
          className="my-tree"
          value={selectedFolderName || "Select folder"}
          multiple={false}
          open={isSelectOpen}
          dropdownRender={dropdownRender}
        />
      </div>
      <div className="btn-group">
        <Button type="ghost">CANCEL</Button>
        <Button className="btn-save" type="primary">
          SAVE
        </Button>
      </div>
    </div>
  );
}
