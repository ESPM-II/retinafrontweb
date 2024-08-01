import { useState, Fragment, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { makeTableColumns } from "./campaigns.base";
import { Form, Input, Upload } from "antd";
import CampaignModalContent from "./CampaignModalContent";
import CampaignPreviewModal from "./CampaignPreviewModal";
import CampaingsTable from "./campaigns.base";
import { GET_ALL_CAMPAINGS } from "../../graphql/Queries/campaings.graphql";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_CAMPAIGN } from "../../graphql/Mutations/createCampaign";
import AddModal from "../../components/Modals/AddModal";
import { message, Spin } from "antd";

const Campaigns = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(true);

  const { data, error, loading } = useQuery(GET_ALL_CAMPAINGS);
  const [createCampaign, { data: mutationData }] = useMutation(CREATE_CAMPAIGN);
  

  const onOk = async () => {
    try {
      const formData = form.getFieldsValue();

      // Construimos la consulta GraphQL en el formato esperado
      const query = `
        mutation CreateCampaign {
          createCampaign(input: { 
            type: "${formData.type}", 
            title: "${formData.title}", 
            description: "${formData.description}" 
          }) {
            success
            message
          }
        }
      `;

      // Imprimimos la consulta completa en la consola
      console.log("GraphQL Request:", query);

      const { data } = await createCampaign({
        variables: {}, // No necesitamos variables adicionales en este caso
        query: query // Enviamos la consulta construida directamente
      });

      setIsModalOpen(false);
      form.resetFields();
      if (data.createCampaign.success) {
        console.log("Campaign created:", data.createCampaign);
        message.success("Campaña creada exitosamente");
      } else {
        console.error("Error creating campaign:", data.createCampaign.message);
        message.error("Error al crear la campaña");
        console.error("GraphQL Error:", err.graphQLErrors, err.networkError);
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      message.error("Error al crear la campaña");
      console.error("GraphQL Error:", err.graphQLErrors, err.networkError);
    }
  };
  
  useEffect(() => {
    //Ocultaré el esqueleto después de 1.5 segundos para dar tiempo a la tabla de cargar
    const timeoutId = setTimeout(() => {
      setShowLoadingSkeleton(false);
    }, 1500);

    return () => {
      //Limpio el timeout cuando desmonto el componente
      clearTimeout(timeoutId);
    };
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  const campaigns = data?.getCampaigns || [];

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <BaseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Campañas Activas"
        title={"Crear nueva campaña"}
        text="Add Campaign"
        onOk={onOk}
        onCancel={onCancel}
        component={
          <Form form={form}>
            <label className="font-bold">Tipo de campaña</label>
            <Form.Item name="type" rules={[{ required: false }]}>
              <Input className="mt-3 mb-3" placeholder="Tipo de campaña" />
            </Form.Item>
            <label className="font-bold">Título</label>
            <Form.Item
              name="title"
              rules={[
                { required: true, message: "Por favor, ingresa un título" },
              ]}
            >
              <Input className="mt-3 mb-3" placeholder="Título de campaña" />
            </Form.Item>
            <label className="font-bold">Descripción</label>
            <Form.Item name="description" rules={[{ required: false }]}>
              <Input.TextArea
                className="mt-3 mb-3"
                placeholder="Descripción de la campaña"
              ></Input.TextArea>
            </Form.Item>
          </Form>
        }
      >
        {" "}
      </BaseModal>
      <main className="w-full h-screen py-2 overflow-y-auto bg-blue-50 flex flex-col items-center justify-cente">
        {showLoadingSkeleton || loading ? (
          <SkeletonTheme baseColor="#F3340B" highlightColor="#F3340B">
            <p>
              <Skeleton count={3} width="100%" />
            </p>
            <Skeleton count={5} height={120} width="80%" />
          </SkeletonTheme>
        ) : campaigns.length > 0 ? (
          <AntTable
            data={campaigns}
            columns={makeTableColumns({
              setIsEditingCampaign,
              setIsModalOpen,
              setIsPreviewModalOpen,
            })}
          ></AntTable>
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
