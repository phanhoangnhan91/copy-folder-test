import "./styles.css";
import { Button, Tree } from "antd";
import { DatePicker, Space } from "antd";

const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        disabled: true,
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
            disableCheckbox: true
          },
          {
            title: "leaf",
            key: "0-0-0-1"
          }
        ]
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: (
              <span
                style={{
                  color: "#1890ff"
                }}
              >
                sss
              </span>
            ),
            key: "0-0-1-0"
          }
        ]
      }
    ]
  }
];
export default function FoldersComponent() {
  return (
    <div
      className="App"
      style={{ height: 540.2, marginTop: 20, backgroundColor: "orange" }}
    >
      <Space direction="vertical">
        <Space direction="vertical">
          <Tree checkable treeData={treeData} />
        </Space>
      </Space>
      ,
    </div>
  );
}
