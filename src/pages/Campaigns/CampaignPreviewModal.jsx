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
          // hoverable
          bordered
          style={{
            width: "100%",
          }}
          cover={
            <img
              alt="Campaign Image"
              src="http://www.centromedicoangamos.cl/wp-content/uploads/2022/12/Disen%CC%83o-sin-ti%CC%81tulo.png"
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
