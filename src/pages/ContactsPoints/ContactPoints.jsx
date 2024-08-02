import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, message, Spin } from "antd";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { GET_ALL_CONTACTS, SAVE_ADMIN_REPLY } from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

export const ContactPoints = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const { data, error, loading } = useQuery(GET_ALL_CONTACTS);
  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <Spin size="large" />
    </div>
  );

  if (error) return <p>Error: {error.message}</p>;

  const contactPoints = data.getContacts.contacts;

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
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
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
        title={`Responder a: ${selectedContact?.content}`}
        text="Responder"
        onOk={onSubmit}
        component={
          <Form form={form}>
            <Form.Item name="description" label="Descripción de la Respuesta">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="content" label="Contenido de la Respuesta">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        }
        onCancel={onCancel}
      />
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
