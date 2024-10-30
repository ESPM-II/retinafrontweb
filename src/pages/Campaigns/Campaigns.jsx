import { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, Spin } from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CAMPAINGS } from "../../graphql/Queries/campaings.graphql";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { makeTableColumns } from "./campaigns.base";
import CampaignModalContent from "./CampaignModalContent";
import CampaignPreviewModal from "./CampaignPreviewModal";
import { CHANGE_VISIBILITY } from "../../graphql/Mutations/changeVisibility";

const Campaigns = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(true);

  const [changeVisibility] = useMutation(CHANGE_VISIBILITY);
  const { data, error, loading, refetch } = useQuery(GET_ALL_CAMPAINGS);

  const getToken = () => localStorage.getItem('authToken'); // Obtener el token dinámicamente

  const onOk = async () => {
    try {
      const formData = await form.validateFields();
      const { type, title, description, image } = formData;
      const file = image[0].originFileObj;

      const uploadData = new FormData();
      uploadData.append('operations', JSON.stringify({
        query: `
          mutation CreateCampaign($type: String!, $title: String!, $description: String!, $image: Upload!) {
            createCampaign(input: { 
              type: $type, 
              title: $title, 
              description: $description, 
              image: $image
            }) {
              success
              message
            }
          }
        `,
        variables: { type, title, description, image: null }
      }));
      uploadData.append('map', JSON.stringify({ '0': ['variables.image'] }));
      uploadData.append('0', file);

      const token = getToken(); // Obtener el token al momento de la solicitud

      if (!token) {
        message.error("No se encontró un token. Por favor, inicia sesión.");
        return;
      }

      const response = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      message.success("Campaña creada exitosamente");
      form.resetFields();
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al crear la campaña:", err);
      message.error("Error al crear la campaña");
    }
  };

  const handleVisibilityChange = async (id) => {
    try {
      const { data } = await changeVisibility({ variables: { id } });
      if (data.changeVisibility.success) {
        message.success("Campaña eliminada exitosamente");
        refetch();
      } else {
        message.error(data.changeVisibility.message);
      }
    } catch (error) {
      message.error("Error al eliminar la campaña");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoadingSkeleton(false);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  const campaigns = (data?.getCampaigns || []).map(campaign => {
    const dateStr = campaign.date;

    if (dateStr) {
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/');
      const dateObj = new Date(`${year}-${month}-${day}T${timePart}`);

      return { ...campaign, dateObj };
    }

    return { ...campaign, dateObj: null };
  }).sort((a, b) => {
    if (!a.dateObj) return 1;
    if (!b.dateObj) return -1;
    return b.dateObj - a.dateObj;
  });

  const onCancel = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <BaseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Campañas Activas"
        title={"Crear nueva campaña"}
        text="Agregar Campaña"
        onOk={onOk}
        onCancel={onCancel}
        component={<CampaignModalContent form={form} />}
      />

      <div className="flex flex-row justify-between items-center p-4 bg-gray-100">
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          className="flex items-center justify-center ml-auto"
        >
          Actualizar
        </Button>
      </div>

      <main className="w-full h-screen py-2 overflow-y-auto bg-blue-50 flex flex-col items-center justify-center">
        {showLoadingSkeleton || loading ? (
          <Spin />
        ) : campaigns.length > 0 ? (
          <AntTable
            data={campaigns}
            columns={makeTableColumns({
              setIsEditingCampaign,
              setIsModalOpen,
              setIsPreviewModalOpen,
              handleVisibilityChange,
            })}
          />
        ) : (
          <p>No se encontraron campañas.</p>
        )}
      </main>

      <CampaignPreviewModal
        selectedCampaign={isEditingCampaign}
        isModalOpen={isPreviewModalOpen}
        setIsModalOpen={setIsPreviewModalOpen}
      />
    </div>
  );
};

export default Campaigns;
