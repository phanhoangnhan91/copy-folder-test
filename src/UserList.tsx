import React from "react";
import { Tag, Input, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface UserProps {
  tags: string[];
  setTags: Function;
}

class UserList extends React.Component<UserProps> {
  state = {
    inputVisible: false,
    inputValue: "",
    editInputIndex: -1,
    editInputValue: ""
  };

  handleClose = (removedTag: string) => {
    const tags = this.props.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e: { target: { value: any } }) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.props;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.props.setTags(tags);
    this.setState({
      inputVisible: false,
      inputValue: ""
    });
  };

  handleEditInputChange = (e: { target: { value: any } }) => {
    this.setState({ editInputValue: e.target.value });
  };

  saveInputRef = (input: any) => {
    this.input = input;
  };

  saveEditInputRef = (input: any) => {
    this.editInput = input;
  };
  input: any;
  editInput: any;

  render() {
    const {
      inputVisible,
      inputValue,
      editInputIndex,
      editInputValue
    } = this.state;
    const tags = this.props.tags || [];
    return (
      <div className="user-input">
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={index !== 0}
              onClose={() => this.handleClose(tag)}
            >
              <span
                onDoubleClick={(e) => {
                  if (index !== 0) {
                    this.setState(
                      { editInputIndex: index, editInputValue: tag },
                      () => {
                        this.editInput.focus();
                      }
                    );
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            style={{ width: 100 }}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> Add a User
          </Tag>
        )}
      </div>
    );
  }
}

export default UserList;
