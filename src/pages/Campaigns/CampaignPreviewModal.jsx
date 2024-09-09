import { Card, Modal } from "antd";

const CampaignPreviewModal = ({ isModalOpen, setIsModalOpen, selectedCampaign }) => {
  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={selectedCampaign.title}
      destroyOnClose
      width={600}
      footer={null}
      open={isModalOpen}
      onCancel={onCancel}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Card
          title={selectedCampaign.createdAt}
          bordered
          style={{
            width: "100%",
          }}
          cover={
            <img
              alt="Campaign Image"
              src={selectedCampaign.image} // Assuming this is the correct way to get the image URL
            />
          }
        >
          {/* Contenido personalizado para mostrar la descripción completa */}
          <div>
            <h3>{selectedCampaign.description}</h3>
            <br/>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default CampaignPreviewModal;
