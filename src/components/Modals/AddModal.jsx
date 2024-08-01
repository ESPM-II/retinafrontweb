import React, { useState } from "react";
import { Button, Modal, Typography, Tooltip, Input, Form, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client"; // Asegúrate de tener Apollo Client configurado
import { CREATE_CAMPAIGN } from "../../graphql/Mutations/createCampaign";

const { Title, TextArea } = Typography;

const AddModal = ({
  headTitle = null,
  title,
  text,
  isModalOpen,
  setIsModalOpen,
  width = 500,
  style = {},
  bodyStyle = {},
  hasAddButton = true,
  refetchCampaigns, // Función para refrescar la lista de campañas (opcional)
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [createCampaign, { loading }] = useMutation(CREATE_CAMPAIGN);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { type, title, description } = values;
      
      Modal.confirm({
        title: "¿Estás seguro de enviar la campaña?",
        onOk: async () => {
          const { data } = await createCampaign({
            variables: { input: { type, title, description, image: imageUrl } },
          });

          if (data.createCampaign.success) {
            message.success(data.createCampaign.message);
            form.resetFields();
            setIsModalOpen(false);
            refetchCampaigns && refetchCampaigns(); // Refrescar si existe
          } else {
            message.error(data.createCampaign.message);
          }
        }
      });

    } catch (error) {
      console.log("Error al validar el formulario:", error);
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url); // Asume que tu backend devuelve la URL
    }
  };

  return (
    // ... resto del componente (encabezado, botón, etc.)
    <Modal /* ... props del modal ... */>
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item 
          label="Tipo de Campaña" 
          name="type" 
          rules={[{ required: true, message: 'Por favor, ingresa el tipo de campaña.' }]}>
          <Input />
        </Form.Item>

        <Form.Item 
          label="Título de la Campaña" 
          name="title" 
          rules={[{ required: true, message: 'Por favor, ingresa el título.' }]}>
          <Input />
        </Form.Item>

        <Form.Item 
          label="Descripción" 
          name="description" 
          rules={[{ required: true, message: 'Por favor, ingresa una descripción.' }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Imagen (Opcional)" name="image">
          <Upload
            name="image"
            action="/api/upload" // Ajusta a tu endpoint de subida
            onChange={handleImageUpload}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Subir Imagen</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Enviar Campaña
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;