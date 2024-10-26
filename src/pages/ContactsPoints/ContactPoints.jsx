import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Form, Input, Button, message, Modal, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { format, parse, compareAsc, compareDesc } from "date-fns";
import {
  GET_DEFERRED_CONTACT_POINTS,
  SAVE_ADMIN_REPLY,
  GET_CONTACT_BY_ID,
} from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

const StatusIndicator = ({ color, label }) => (
  <div className="flex items-center mr-4">
    <div className={`w-4 h-4 rounded-full ${color} mr-2`} />
    <span>{label}</span>
  </div>
);

const ContactPoints = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewContent, setViewContent] = useState({});
  const [sortedContacts, setSortedContacts] = useState([]);
  const [orderDirection, setOrderDirection] = useState("desc");

  const { data, error, loading, refetch } = useQuery(GET_DEFERRED_CONTACT_POINTS, {
    fetchPolicy: "network-only", // Asegura que siempre obtengas datos del servidor
    onError: (err) => console.error("Error fetching contacts:", err),
  });

  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);

  const [getContactById] = useLazyQuery(GET_CONTACT_BY_ID, {
    onCompleted: (data) => {
      console.log("Estado cambiado a Visto para contactID:", data.getContactByContactId.contactID);
      refetch();
    },
    onError: (error) => console.error("Error al cambiar estado a Visto:", error),
  });

  useEffect(() => {
    if (data && data.getContacts && data.getContacts.contacts) {
      const allContacts = data.getContacts.contacts;

      const contactPoints = allContacts.filter(
        (contact) => contact.status !== "respuesta"
      );

      const formattedContacts = contactPoints.map((contact) => {
        const parsedDate = parse(contact.createdAt, "dd/MM/yyyy HH:mm:ss", new Date());
        return {
          ...contact,
          createdAt: format(parsedDate, "dd/MM/yyyy HH:mm:ss"),
        };
      });

      const sortedByDate = [...formattedContacts].sort((a, b) => {
        const dateA = parse(a.createdAt, "dd/MM/yyyy HH:mm:ss", new Date());
        const dateB = parse(b.createdAt, "dd/MM/yyyy HH:mm:ss", new Date());
        return compareDesc(dateA, dateB);
      });

      setSortedContacts(sortedByDate);
    }
  }, [data]);

  const handleSortByDate = () => {
    const sortedData = [...sortedContacts].sort((a, b) =>
      orderDirection === "asc"
        ? compareAsc(new Date(a.createdAt), new Date(b.createdAt))
        : compareDesc(new Date(a.createdAt), new Date(b.createdAt))
    );
    setSortedContacts(sortedData);
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    form.resetFields();
  };

  const onRespond = (record) => {
    setSelectedContact(record);
    setIsModalOpen(true);

    form.setFieldsValue({
      contactType: record.contactPointType,
      incomingMessage: record.content,
    });

    getContactById({ variables: { contactID: record.contactID } });
  };

  const onView = (record) => {
    const response = data?.getContacts?.contacts?.find(
      (contact) =>
        contact.contactID === record.contactID && contact.status === "respuesta"
    );

    setViewContent({
      message: record.content,
      name: record.userData,
      email: record.userEmail,
      fecha: record.createdAt,
      estado: record.status,
      responseContent: response ? response.content : null,
      responseDate: response ? response.createdAt : null,
    });

    setIsViewModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { content } = values;

      if (!selectedContact || !selectedContact.contactID) {
        console.error("No contact selected or contactID is missing");
        return;
      }

      await saveAdminReply({
        variables: {
          input: {
            contactID: selectedContact.contactID,
            description: selectedContact.contactPointType,
            content,
          },
        },
      });

      message.success("Respuesta enviada exitosamente");
      setIsModalOpen(false);
      form.resetFields();
      await refetch();
    } catch (error) {
      console.error("Error saving admin reply:", error);
      message.error("Error al enviar la respuesta");
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <BaseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        headTitle="Responder Punto de Contacto"
        title={`Responder a: ${selectedContact?.userData}`}
        onOk={onSubmit}
        component={
          <Form form={form} layout="vertical">
            <Form.Item name="contactType" label="Tipo de mensaje">
              <Input type="text" readOnly />
            </Form.Item>
            <Form.Item name="incomingMessage" label="Descripción">
              <Input.TextArea readOnly />
            </Form.Item>
            <Form.Item
              name="content"
              label="Tu respuesta"
              rules={[{ required: true, message: "La respuesta es obligatoria" }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Form>
        }
        onCancel={onCancel}
      />

      <Modal
        title="Detalle del Mensaje"
        visible={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={<Button onClick={() => setIsViewModalOpen(false)}>Cerrar</Button>}
      >
        <p><strong>Nombre usuario:</strong> {viewContent.name}</p>
        <p><strong>Email usuario:</strong> {viewContent.email}</p>
        <p><strong>Recibido el:</strong> {viewContent.fecha}</p>
        <p><strong>Mensaje del usuario:</strong> {viewContent.message}</p>
        <p><strong>Estado:</strong> {viewContent.estado}</p>
        {viewContent.responseContent && (
          <>
            <p><strong>Fecha de Respuesta:</strong> {viewContent.responseDate}</p>
            <p><strong>Respuesta:</strong> {viewContent.responseContent}</p>
          </>
        )}
      </Modal>

      <div className="flex justify-between items-center p-4 bg-gray-100">
        <div className="flex">
          <StatusIndicator color="bg-red-500" label="Sin responder" />
          <StatusIndicator color="bg-yellow-500" label="Visto" />
          <StatusIndicator color="bg-green-500" label="Respondido" />
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          Actualizar
        </Button>
      </div>

      <main className="flex w-full h-full overflow-y-auto">
        <AntTable
          data={sortedContacts}
          columns={makeTableColumns({ onRespond, onView, handleSortByDate })}
        />
      </main>
    </div>
  );
};

export default ContactPoints;
