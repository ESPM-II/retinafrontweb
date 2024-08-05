import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const CampaignModalContent = ({ form }) => {
  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <Form form={form} onFinish={onFinish}>
        <Form.Item 
          name="type" 
          rules={[{ required: true, message: "Por favor ingresa el tipo de campaña" }]}>
          <Input className="mt-3 mb-3" placeholder="Tipo de campaña"/>
        </Form.Item>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Por favor, ingresa un título" }]}
        >
          <Input className="mt-3 mb-3" placeholder="Título de campaña" />
        </Form.Item>
        <Form.Item name="description" rules={[{ required: true, message: "Por favor, ingresa la descripción e la campaña" }]}>
          <Input.TextArea className="mt-3 mb-3" placeholder="Descripción de la campaña" />
        </Form.Item>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          rules={[{ required: false}]}
        >
          <Upload name="image" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Subir imagen</Button>
          </Upload>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CampaignModalContent;
