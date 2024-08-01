import { Card, Modal } from "antd";

const { Meta } = Card;

const CampaignPreviewModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedCampaign,
}) => {
  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={selectedCampaign.title}
      destroyOnClose
      width={600}
      footer={<></>}
      open={isModalOpen}
      onOk={() => {}}
      onCancel={onCancel}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Card
          title={selectedCampaign.title}
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
          <Meta
            title={selectedCampaign.description}
            description={selectedCampaign.campaignText}
            createdAt={selectedCampaign.createdAt}
          />
        </Card>
      </div>
    </Modal>
  );
};

export default CampaignPreviewModal;
