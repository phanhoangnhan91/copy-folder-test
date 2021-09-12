import React, { useState, useCallback } from "react";
import { Input, Select } from "antd";
import { SaveFilled, DeleteFilled } from "@ant-design/icons";
import UserList from "./UserList";

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
  const [users, setUsers] = useState<Array<string>>([]);
  const [folderTitle, setFolderTitle] = useState<string>("");
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
      console.log("user", users);
      return {
        title: folderTitle || "New Folder",
        value: nodeData.value,
        key: nodeData.key,
        users: !customizedVissibility ? selectedVisibility : [...users],
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
      <div className="custom-option__block">
        <Input
          style={{ flex: "auto" }}
          value={folderTitle}
          className="folder-name"
          placeholder="Enter folder name"
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
        {customizedVissibility && <UserList tags={users} setTags={setUsers} />}
        <div className="btn-group">
          <DeleteFilled
            style={{
              fontSize: "30px",
              color: "#d3455c",
              paddingRight: "10px"
            }}
            onClick={deleteDraftFolder}
          />
          <SaveFilled
            style={{ fontSize: "30px", color: "#1bae9f" }}
            onClick={saveDraftFolder}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3>{nodeData.title}</h3>
      <div>
        {isVisibleToAll
          ? "Visible to Everyone"
          : isVisibleToMe
          ? "Only visible to Me"
          : "Visible to " + nodeData.users.join(", ")}
      </div>
    </div>
  );
};

export default FolderTreeNode;
