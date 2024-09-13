import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Form, Input, Button, message, Spin } from "antd";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { GET_ALL_CONTACTS, SAVE_ADMIN_REPLY, GET_CONTACT_BY_ID } from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

// Indicador de estado
const StatusIndicator = ({ color, label }) => (
  <div className="flex items-center mr-4">
    <div className={`w-4 h-4 rounded-full ${color} mr-2`}></div>
    <span
      className={`border rounded-full px-2 py-1 text-sm border-${color.replace(
        "bg-",
        ""
      )} text-${color.replace("bg-", "")}`}
    >
      {label}
    </span>
  </div>
);

export const ContactPoints = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Apollo Client: Obtener contactos con `refetch`
  const { data, error, loading, refetch } = useQuery(GET_ALL_CONTACTS);
  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);

  // Define la query `GET_CONTACT_BY_ID` de manera perezosa
  const [getContactById] = useLazyQuery(GET_CONTACT_BY_ID, {
    onCompleted: (data) => {
      console.log("Estado cambiado a Visto para contactID:", data.getContactByContactId.contactID);
      refetch(); // Refresca los datos después de cambiar el estado
    },
    onError: (error) => {
      console.error("Error al cambiar estado a Visto:", error);
    },
  });

  // Efecto para cargar el contacto seleccionado en el formulario
  useEffect(() => {
    if (selectedContact) {
      form.setFieldsValue({
        contactType: selectedContact.contactPointType,
        incomingMessage: selectedContact.content,
      });
    }
  }, [selectedContact, form]);

  // Manejador de carga, error y datos
  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );

  if (error) return <p>Error: {error.message}</p>;

  // Filtrar puntos de contacto para excluir aquellos con estado "respuesta"
  const contactPoints = data.getContacts.contacts.filter(
    (contact) => contact.status !== "respuesta"
  );

  // Manejador de cancelación del modal
  const onCancel = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    form.resetFields();
  };

  // Manejador de selección para responder
  const onRespond = (record) => {
    setSelectedContact(record);
    setIsModalOpen(true);

    // Ejecuta la query para cambiar el estado a "Visto"
    getContactById({
      variables: {
        contactID: record.contactID, // Pasa el contactID como variable
      },
    });
  };

  // Manejador de envío de respuesta
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
      await refetch(); // Refrescar datos después de enviar la respuesta
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

      {/* Indicadores de estado antes de la tabla */}
      <div className="flex flex-row justify-start items-center p-4 bg-gray-100">
        <StatusIndicator
          color="bg-red-500"
          label="Sin responder"
        />
        <StatusIndicator
          color="bg-yellow-500"
          label="Visto"
        />
        <StatusIndicator
          color="bg-green-500"
          label="Respondido"
        />
      </div>

      {/* Tabla de puntos de contacto */}
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable
          data={contactPoints}
          columns={makeTableColumns({
            onRespond,
          })}
        />
      </main>
    </div>
  );
};

export default ContactPoints;
