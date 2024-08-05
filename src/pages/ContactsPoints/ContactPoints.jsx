import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, message, Spin } from "antd";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import {
  GET_ALL_CONTACTS,
  SAVE_ADMIN_REPLY,
} from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

const StatusIndicator = ({ color, label }) => (
  <div className="flex items-center mr-4">
    <div className={`w-4 h-4 rounded-full ${color} mr-2`}></div>
    <span
      className={`border bg-transparent rounded-full px-2 py-1 text-sm ${color}-border`}
    >
      {label}
    </span>
  </div>
);

export const ContactPoints = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const { data, error, loading } = useQuery(GET_ALL_CONTACTS);
  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);

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

  // Filtrar los puntos de contacto para excluir aquellos con status "respuesta"
  const contactPoints = data.getContacts.contacts.filter(
    (contact) => contact.status !== "respuesta"
  );

  const onCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
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
            description,
            content,
          },
        },
      });
      setIsModalOpen(false);
      form.resetFields();
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

  const onRespond = (record) => {
    setSelectedContact(record);
    setIsModalOpen(true);
    console.log("Selected contact: ", record);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
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
              name="description"
              label="Asunto de la respuesta"
              rules={[
                {
                  required: true,
                  message: "El asunto de la respuesta es obligatorio",
                },
              ]}
            >
              <Input.TextArea rows={4} />
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
      <div className="flex flex-row justify-start items-center p-4 bg-gray-100">
        <StatusIndicator
          color="bg-red-500 border-red-500 text-red-500"
          label="Sin responder"
        />
        <StatusIndicator
          color="bg-yellow-500 border-yellow-500 text-yellow-500"
          label="Visto"
        />
        <StatusIndicator
          color="bg-green-500 border-green-500 text-green-500"
          label="Respondido"
        />
      </div>
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
