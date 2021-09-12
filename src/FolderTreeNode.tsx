import React, { useState, useCallback } from "react";
import { Input, Select } from "antd";
import { SaveFilled, DeleteFilled } from "@ant-design/icons";
//import EditableTagGroup from "@layout/user_input";

const { Option } = Select;
export interface FolderNode {
  nodeData: StateType;
  setData: (data: any) => void;
  data: any;
}
type StateType = {
  title: string;
  value: string;
  key: string;
  users?: any;
  draft: any;
  children?: Array<StateType>;
};

const FolderTreeNode = ({ nodeData, data, setData }: FolderNode) => {
  const [selectedVisibility, setSelectedVisibility] = useState<any>(-1);
  // eslint-disable-next-line
  const [users, setUsers] = useState<Array<string>>([]);
  const [folderTitle, setFolderTitle] = useState<string>("New Folder");
  const isVisibleToAll = nodeData.users === -1;
  const isVisibleToMe = nodeData.users === 0;
  const customizedVissibility = selectedVisibility === 1;

  const onNameChange = (e: any) => {
    setFolderTitle(e.target.value);
  };

  const deleteDraftFolder = useCallback(() => {
    const filteredData = data.filter(
      (item: any) => item.value !== nodeData.value
    );
    setData(filteredData);
  }, [data, nodeData, setData]);

  const saveDraftFolder = useCallback(() => {
    const updatedData = data.map((item: any) => {
      if (item.value !== nodeData.value) {
        return item;
      }
      return {
        title: folderTitle || "New Folder",
        value: nodeData.value,
        key: nodeData.key,
        users: !customizedVissibility ? selectedVisibility : users,
        draft: 0
      };
    });
    setData(updatedData);
  }, [
    data,
    nodeData,
    setData,
    customizedVissibility,
    folderTitle,
    selectedVisibility,
    users
  ]);

  if (nodeData.draft === 1) {
    return (
      <>
        <div className="custom-option__block">
          <Input
            style={{ flex: "auto" }}
            value={folderTitle}
            onChange={onNameChange}
          />
          <Select
            defaultValue={selectedVisibility}
            style={{ width: 380, marginTop: "10px" }}
            onChange={setSelectedVisibility}
          >
            <Option value={-1}>Visible to Everyone</Option>
            <Option value={0}>Only visible to Me</Option>
            <Option value={1}>Visible to Specific Users</Option>
          </Select>
          {/* TODO: {customizedVissibility && <EditableTagGroup />} */}
          <div className="custom-option__action">
            <DeleteFilled
              style={{ fontSize: "30px", color: "red", paddingRight: "10px" }}
              onClick={deleteDraftFolder}
            />
            <SaveFilled
              style={{ fontSize: "30px", color: "#08c" }}
              onClick={saveDraftFolder}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="custom-option__block">
      <span className="custom-option__title">{nodeData.title}</span>
      <div>
        {isVisibleToAll
          ? "Visible to Everyone"
          : isVisibleToMe
          ? "Only visible to Me"
          : "Visible to Specific Users"}
      </div>
    </div>
  );
};

export default FolderTreeNode;
