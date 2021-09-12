import "./styles.css";
import { Button, Tree, TreeSelect, Input } from "antd";
import React, { useState, useCallback, useMemo } from "react";
import FolderTreeNode from "./FolderTreeNode";
import { v4 } from "uuid";
import "./FoldersComponent.less";

const { Search } = Input;
const { DirectoryTree } = Tree;

const treeData = [
  {
    title: "My folder name 1",
    value: "0-0",
    users: -1,
    key: v4(),
    draft: 0,
    children: [
      {
        title: "My folder name 1-a",
        value: "0-0-1",
        key: v4(),
        users: -1,
        draft: 0
      },
      {
        title: "My folder name 1-b",
        value: "0-0-2",
        key: v4(),
        users: -1,
        draft: 0
      }
    ]
  },
  {
    title: "My folder name 2",
    value: "0-1",
    key: v4(),
    users: 0,
    draft: 0
  }
];

export type StateType = {
  key: string;
  title: string;
  value: string;
  users?: any;
  draft?: any;
  children?: Array<StateType>;
};

export default function FoldersComponent() {
  const [data, setData] = useState<Array<StateType>>(treeData);
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

      const loop = (data: any, key: number, callback: any, vis: any) => {
        let parentVis = vis;
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data, parentVis);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback, data[i].users);
          }
        }
      };
      const clonedData = [...data];

      let dragObj: any;
      loop(
        clonedData,
        dragKey,
        (item: any, index: number, arr: Array<StateType>) => {
          arr.splice(index, 1);
          dragObj = item;
        },
        null
      );

      if (!info.dropToGap) {
        loop(
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
        loop(
          clonedData,
          dropKey,
          (item: any) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
          },
          null
        );
      } else {
        let ar: Array<StateType> = [];
        let i = 0;
        loop(
          clonedData,
          dropKey,
          (item: any, index: number, arr: Array<StateType>) => {
            ar = arr;
            i = index;
          },
          null
        );
        const temp: StateType = { ...dragObj };
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

      loop(
        clonedData,
        dragKey,
        (item: any, index: number, arr: Array<StateType>, parentVis: any) => {
          if (!parentVis) {
            return;
          }
          item.users = parentVis;
          // eslint-disable-next-line
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
  const searchRes = useMemo(() => {
    const loop = (dataArr: any) =>
      dataArr.map((item: any) => {
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
        if (item.children) {
          return {
            ...item,
            title,
            originalTitle: item.title,
            key: item.key,
            children: loop(item.children)
          };
        }

        return {
          ...item,
          title,
          originalTitle: item.title,
          key: item.key
        };
      });
    return loop(data);
  }, [data, searchValue]);
  return (
    <div
      className="App"
      style={{ height: 540.2, marginTop: 20, marginLeft: 30, marginRight: 30 }}
    >
      <div
        onClick={() => {
          setIsSelectOpen(!isSelectOpen);
        }}
      >
        <h1> Copy Data to Folder</h1>
        <TreeSelect
          style={{ width: "100%" }}
          id="test"
          dropdownStyle={{ maxHeight: 500, overflow: "auto" }}
          placeholder=""
          value={selectedFolderName || "Select Folder"}
          multiple={false}
          open={isSelectOpen}
          dropdownRender={() => (
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
                <Search
                  style={{ paddingRight: "8px" }}
                  placeholder="Search"
                  onChange={onSearchChange}
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
                treeData={searchRes}
                titleRender={(nodeData: any) => {
                  return (
                    <FolderTreeNode
                      setData={setData}
                      data={data}
                      nodeData={nodeData}
                    />
                  );
                }}
                onSelect={(e: any) => {
                  const findInLoop = (data: any, callback: any, val: any) => {
                    for (let i = 0; i < data.length; i++) {
                      if (data[i].key === e[0] && data[i].draft !== 1) {
                        return callback(data[i]);
                      }
                      if (data[i].children) {
                        findInLoop(data[i].children, callback, val);
                      }
                    }
                  };
                  let title = "";
                  findInLoop(
                    searchRes,
                    (item: any) => {
                      title = item.originalTitle;
                      setIsSelectOpen(!isSelectOpen);
                    },
                    e
                  );
                  setSelectedFolderName(title);
                }}
                key="dsads"
              />
            </div>
          )}
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
