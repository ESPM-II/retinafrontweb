import { Button, Modal, Typography, Tooltip, Input } from "antd";

const DocumentsModal = ({ isModalOpen, setIsModalOpen, editingDocument }) => {
  const onCancel = () => {
    setIsModalOpen(false);
  };

  console.log(editingDocument);

  return (
    <>
      <Modal
        title="Document List"
        destroyOnClose
        width={400}
        footer={<></>}
        open={isModalOpen}
        onOk={() => {}}
        onCancel={onCancel}
      >
        <div className="flex flex-col">
          {editingDocument?.documents?.map((doc, i) => (
            <div className="flex w-full gap-1" key={i}>
              <>{i + 1} - </>
              <a>{doc.fakeDocId}.pdf</a>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default DocumentsModal;
