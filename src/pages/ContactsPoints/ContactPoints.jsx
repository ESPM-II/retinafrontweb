import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Form, Input, Button, message, Spin, Modal, Tooltip } from "antd";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { format, parse } from "date-fns";
import { GET_ALL_CONTACTS, SAVE_ADMIN_REPLY, GET_CONTACT_BY_ID, GET_DEFERRED_CONTACT_POINTS } from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

// Componente de indicador de estado
const StatusIndicator = ({ color }) => (
  <div className="flex items-center">
    <div className={`w-4 h-4 rounded-full ${color}`} />
  </div>
);

const ContactPoints = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Estado para el modal de vista
  const [viewContent, setViewContent] = useState({}); // Estado para almacenar el contenido del modal de vista

  // Apollo Client: Obtener todos los puntos de contacto
  const { data, error, loading, refetch } = useQuery(GET_DEFERRED_CONTACT_POINTS);
  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);

  const [getContactById] = useLazyQuery(GET_CONTACT_BY_ID, {
    onCompleted: (data) => {
      console.log("Estado cambiado a Visto para contactID:", data.getContactByContactId.contactID);
      refetch();
    },
    onError: (error) => {
      console.error("Error al cambiar estado a Visto:", error);
    },
  });

  useEffect(() => {
    if (selectedContact) {
      form.setFieldsValue({
        contactType: selectedContact.contactPointType,
        incomingMessage: selectedContact.content,
      });
    }
  }, [selectedContact, form]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  // Obtener todos los contactos y filtrar los que no son respuestas
  const allContacts = data.getDeferredContactPoints.contacts;
  const contactPoints = allContacts.filter(
    (contact) => contact.status !== "respuesta"
  );

  // Formatear las fechas antes de renderizarlas
  const formattedContacts = contactPoints.map((contact) => {
    const parsedDate = parse(contact.createdAt, "dd/MM/yyyy", new Date());
    return {
      ...contact,
      createdAt: format(parsedDate, "yyyy-MM-dd HH:mm:ss"),
    };
  });

  const onCancel = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    form.resetFields();
  };

  const onRespond = (record) => {
    setSelectedContact(record);
    setIsModalOpen(true);

    getContactById({
      variables: {
        contactID: record.contactID,
      },
    });
  };

  const onView = (record) => {
    // Buscar la respuesta relacionada al mismo contactID
    const response = allContacts.find(
      (contact) => contact.contactID === record.contactID && contact.status === "respuesta"
    );

    setViewContent({
      message: record.content,
      name: record.userData,
      email: record.userEmail,
      fecha: record.createdAt,
      estado: record.status,
      responseContent: response ? response.content : null, // Contenido de la respuesta si existe
      responseDate: response ? response.createdAt : null, // Fecha de la respuesta si existe
    });

    setIsViewModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const { description, content } = values;
    if (!selectedContact || !selectedContact.contactID) {
      console.error("No contact selected or contactID is missing");
      return;
    }
    try {
      console.log("Responding to contactID: ", selectedContact.contactID);
      message.success("Respuesta enviada exitosamente");
      await saveAdminReply({
        variables: {
          input: {
            contactID: selectedContact.contactID,
            description: selectedContact.contactPointType,
            content,
          },
        },
      });
      setIsModalOpen(false);
      form.resetFields();
      await refetch();
    } catch (error) {
      console.error("Error saving admin reply: ", error);
      message.error("Error al enviar la respuesta");
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (error.networkError) {
        console.log(`[Network error]: ${error.networkError}`);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Modal para responder a un punto de contacto */}
      <BaseModal
        hasAddButton={false}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Responder Punto de Contacto"
        title={`Responder a: ${selectedContact?.userData}`}
        text="Responder"
        onOk={onSubmit}
        component={
          <Form form={form} layout="vertical">
            <Form.Item name="contactType" label="Tipo de mensaje">
              <Input
                type="text"
                value={selectedContact?.contactPointType}
                readOnly
              />
            </Form.Item>
            <Form.Item name="incomingMessage" label="Descripción">
              <Input.TextArea value={selectedContact?.content} readOnly />
            </Form.Item>
            <Form.Item
              name="content"
              label="Tu respuesta"
              rules={[
                { required: true, message: "La respuesta es obligatoria" },
              ]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Form>
        }
        onCancel={onCancel}
      />

      {/* Modal para ver detalles del mensaje */}
      <Modal
        title="Detalle del Mensaje"
        visible={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Cerrar
          </Button>,
        ]}
      >
        <p><strong>Nombre usuerio:</strong> {viewContent.name}</p>
        <p><strong>Email usuario:</strong> {viewContent.email}</p>
        <p><strong>Recibido el:</strong> {viewContent.fecha}</p>
        <p><strong>Mensaje del usuario:</strong> {viewContent.message}</p>
        <p><strong>Estado punto de contacto:</strong> {viewContent.estado}</p>
        <br/>
        {viewContent.responseContent && (
          <>
            <p><strong>Fecha de Respuesta:</strong> {viewContent.responseDate}</p>
            <p><strong>Respuesta:</strong> {viewContent.responseContent}</p>
          </>
        )}
      </Modal>

      {/* Indicadores de estado antes de la tabla */}
      <div className="flex flex-row justify-start items-center p-4 bg-gray-100">
        <StatusIndicator color="bg-red-500" label="Sin responder" />
        <StatusIndicator color="bg-yellow-500" label="Visto" />
        <StatusIndicator color="bg-green-500" label="Respondido" />
      </div>

      {/* Tabla de puntos de contacto */}
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable
          data={formattedContacts}
          columns={makeTableColumns({
            onRespond,
            onView, // Pasar el manejador de vista al componente de la tabla
          })}
        />
      </main>
    </div>
  );
};

export default ContactPoints;
