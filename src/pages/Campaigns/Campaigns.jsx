import { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, Spin } from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CAMPAINGS } from "../../graphql/Queries/campaings.graphql"; // Asegúrate de que esta ruta es correcta
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { makeTableColumns } from "./campaigns.base";
import CampaignModalContent from "./CampaignModalContent";
import CampaignPreviewModal from "./CampaignPreviewModal";
import { CHANGE_VISIBILITY } from "../../graphql/Mutations/changeVisibility"; // Asegúrate de que esta ruta es correcta

const Campaigns = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(true);
  
  const [changeVisibility] = useMutation(CHANGE_VISIBILITY);
  const { data, error, loading, refetch } = useQuery(GET_ALL_CAMPAINGS);

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
  
      const token = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImUwM2E2ODg3YWU3ZjNkMTAyNzNjNjRiMDU3ZTY1MzE1MWUyOTBiNzIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHItZWRpZmljaW8tZGVmb3JtZXMiLCJhdWQiOiJkci1lZGlmaWNpby1kZWZvcm1lcyIsImF1dGhfdGltZSI6MTcyNjY3NDg0MCwidXNlcl9pZCI6ImNNU3JWVTFibURYYmh1Z09DOEMwV3lVWGxVRTIiLCJzdWIiOiJjTVNyVlUxYm1EWGJodWdPQzhDMFd5VVhsVUUyIiwiaWF0IjoxNzI2Njc0ODQwLCJleHAiOjE3MjY2Nzg0NDAsImVtYWlsIjoiamphb2xpdm9zLjAyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImpqYW9saXZvcy4wMkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.ZPxrB0j9mD7QvVIINAfliOM7RCposKARibUl6QfuW9dkStZiqSjnDbpQMS41cbCOsqbXhLls2rN_jRtlp3IitlLYQusom2tUxxSOWc7SpE7Te95XAa5W6PNeUd7HZYzoJOzKDUKOcZkTyJjFjQ9cFFLAtrWC63M3BNdLsveKC8J_dnsof6fsJG4UVjPwW29sf4ROmeM7kEqyafl_8Z8hMS_B1z_Ojypmp4vsDy3xVvD4BxxjVlChjmO23DXFrvDWj6Fz4Ek1q5wOhcDGlIi8vSIJrTzhANKJoO4L3EmoDzgfv2EhPB_RmOT29NTgnnObe5VSZQm6wqamAEQcv28dvw';
  
      const response = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': token,
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
      console.error("Error creating campaign:", err);
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
    // Verificar si la fecha existe antes de intentar manipularla
    const dateStr = campaign.date; // Asegúrate de que 'campaign.date' sea el campo correcto
    
    if (dateStr) {
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/');
      
      // Crear un objeto Date utilizando los valores extraídos (año, mes - 1 porque el mes en Date empieza en 0, día)
      const dateObj = new Date(`${year}-${month}-${day}T${timePart}`);
      
      return {
        ...campaign,
        dateObj: dateObj // Guardar el objeto Date para ordenar
      };
    }
  
    return {
      ...campaign,
      dateObj: null // Si no hay fecha, asignar null
    };
  }).sort((a, b) => {
    // Si alguno de los objetos dateObj es null, lo empujamos al final de la lista
    if (!a.dateObj) return 1;
    if (!b.dateObj) return -1;
    // Ordenar de mayor a menor (más reciente a más antigua)
    return b.dateObj - a.dateObj;
  });
  

  const onCancel = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Modal para crear nueva campaña */}
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

      {/* Botón de Actualizar y Tabla */}
      <div className="flex flex-row justify-between items-center p-4 bg-gray-100">
        <div className="flex">
          {/* Puedes agregar cualquier indicador o texto adicional aquí si lo deseas */}
        </div>
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          className="flex items-center justify-center"
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

      {/* Modal para previsualizar campaña */}
      <CampaignPreviewModal
        selectedCampaign={isEditingCampaign}
        isModalOpen={isPreviewModalOpen}
        setIsModalOpen={setIsPreviewModalOpen}
      />
    </div>
  );
};

export default Campaigns;
