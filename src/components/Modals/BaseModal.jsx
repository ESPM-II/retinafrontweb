import React from "react";
import { Button, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const BaseModal = ({
  headTitle = null,
  title,
  text,
  component = <></>,
  onOk = () => {},
  onCancel = () => {},
  isModalOpen,
  setIsModalOpen,
  width = 500,
  style = {},
  bodyStyle = {},
  hasAddButton = true,
}) => {
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col justify-between w-full">
      {headTitle && (
        <header className="flex flex-row items-center justify-between px-6 py-4 rounded bg-[#199276]">
          <Title
            level={3}
            style={{
              color: "white",
              margin: "0 0 0 0",
            }}
          >
            {headTitle}
          </Title>
          
          {hasAddButton && (
            <Button
              style={{ 
                backgroundColor: "#199276", 
                borderColor: "white", 
                color: "white", 
                borderRadius: "24px" 
              }}
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              {text}
            </Button>
          )}
        </header>
      )}
      <Modal
        title={title}
        destroyOnClose
        okText="Aceptar"
        width={width}
        style={{ ...style }}
        bodyStyle={{ ...bodyStyle }}
        okButtonProps={{
          type: "default",
          htmlType: "submit",
        }}
        cancelButtonProps={{
          danger: true,
          type: "default",
        }}
        open={isModalOpen}
        onOk={onOk}
        onCancel={onCancel}
      >
        {component}
      </Modal>
    </div>
  );
};

export default BaseModal;
