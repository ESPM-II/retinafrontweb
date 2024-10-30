import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Form, Input, Button, message, Modal, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { format, parse, isValid, compareAsc, compareDesc } from "date-fns";
import {
  GET_DEFERRED_CONTACT_POINTS,
  SAVE_ADMIN_REPLY,
  GET_CONTACT_BY_ID,
} from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

const ContactPoints = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewContent, setViewContent] = useState({});
  const [sortedContacts, setSortedContacts] = useState([]);
  const [orderDirection, setOrderDirection] = useState("desc");

  const { data, loading, refetch } = useQuery(GET_DEFERRED_CONTACT_POINTS, {
    fetchPolicy: "network-only",
    onError: (err) => console.error("Error fetching contacts:", err),
  });

  const StatusIndicator = ({ color, label }) => (
    <div className="flex items-center mr-4">
      <div className={`w-4 h-4 rounded-full ${color} mr-2`} />
      <span>{label}</span>
    </div>
  );
  

  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);
  const [getContactById] = useLazyQuery(GET_CONTACT_BY_ID, {
    onCompleted: () => refetch(),
    onError: (error) =>
      console.error("Error al cambiar estado a Visto:", error),
  });

  const formatDate = (dateString) => {
    try {
      const parsedDate = parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd/MM/yyyy HH:mm:ss");
      }
      return "Fecha inválida";
    } catch {
      return "Fecha inválida";
    }
  };

  useEffect(() => {
    if (data?.getContacts?.contacts) {
      const contactPoints = data.getContacts.contacts.filter(
        (contact) => contact.status !== "respuesta"
      );

      const formattedContacts = contactPoints.map((contact) => ({
        ...contact,
        createdAt: formatDate(contact.createdAt),
      }));

      const sortedByDate = formattedContacts.sort((a, b) =>
        compareDesc(
          parse(a.createdAt, "dd/MM/yyyy HH:mm:ss", new Date()),
          parse(b.createdAt, "dd/MM/yyyy HH:mm:ss", new Date())
        )
      );

      setSortedContacts(sortedByDate);
    }
  }, [data]);

  const handleSortByDate = () => {
    const sortedData = [...sortedContacts].sort((a, b) =>
      orderDirection === "asc"
        ? compareAsc(
            parse(a.createdAt, "dd/MM/yyyy HH:mm:ss", new Date()),
            parse(b.createdAt, "dd/MM/yyyy HH:mm:ss", new Date())
          )
        : compareDesc(
            parse(a.createdAt, "dd/MM/yyyy HH:mm:ss", new Date()),
            parse(b.createdAt, "dd/MM/yyyy HH:mm:ss", new Date())
          )
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
    const response = data?.getContacts?.contacts.find(
      (contact) =>
        contact.contactID === record.contactID && contact.status === "respuesta"
    );

    setViewContent({
      message: record.content,
      name: record.userData,
      email: record.userEmail,
      fecha: formatDate(record.createdAt),
      estado: record.status,
      responseContent: response ? response.content : null,
      responseDate: response ? formatDate(response.createdAt) : null,
    });

    setIsViewModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedContact) throw new Error("No contact selected");
      await saveAdminReply({
        variables: {
          input: {
            contactID: selectedContact.contactID,
            description: selectedContact.contactPointType,
            content: values.content,
          },
        },
      });
      message.success("Respuesta enviada exitosamente");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error) {
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
              <Input readOnly />
            </Form.Item>
            <Form.Item name="incomingMessage" label="Descripción">
              <Input.TextArea readOnly />
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

      <Modal
        title="Detalle del Mensaje"
        visible={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={
          <Button onClick={() => setIsViewModalOpen(false)}>Cerrar</Button>
        }
      >
        <p>
          <strong>Nombre usuario:</strong> {viewContent.name}
        </p>
        <p>
          <strong>Email usuario:</strong> {viewContent.email}
        </p>
        <p>
          <strong>Recibido el:</strong> {viewContent.fecha}
        </p>
        <p>
          <strong>Mensaje del usuario:</strong> {viewContent.message}
        </p>
        <p>
          <strong>Estado:</strong> {viewContent.estado}
        </p>
        {viewContent.responseContent && (
          <>
            <p>
              <strong>Fecha de Respuesta:</strong> {viewContent.responseDate}
            </p>
            <p>
              <strong>Respuesta:</strong> {viewContent.responseContent}
            </p>
          </>
        )}
      </Modal>

      <div className="flex flex-row justify-between items-center p-4 bg-gray-100">
      <div className="flex ">
    <StatusIndicator color="bg-green-500" label="Respondido" />
    <StatusIndicator color="bg-yellow-500" label="Visto" />
    <StatusIndicator color="bg-red-500" label="Sin responder" />
  </div>
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          className="flex items-center justify-center ml-auto"
        >
          Actualizar
        </Button>
      </div>

      <AntTable
        data={sortedContacts}
        columns={makeTableColumns({ onRespond, onView, handleSortByDate })}
      />
    </div>
  );
};

export default ContactPoints;
