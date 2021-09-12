import { v4 } from "uuid";
import { FolderNode } from "./FoldersComponent";
export const treeData: FolderNode[] = [
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
