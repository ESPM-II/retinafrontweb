import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Form, Input, Button, message, Spin, Modal, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import BaseModal from "../../components/Modals/BaseModal";
import AntTable from "../../components/Tables/AntTable";
import { format, parse, compareAsc, compareDesc } from "date-fns"; // Importa funciones para comparar fechas
import {
  GET_ALL_CONTACTS,
  SAVE_ADMIN_REPLY,
  GET_CONTACT_BY_ID,
  GET_DEFERRED_CONTACT_POINTS,
} from "../../graphql/Queries/contactPoints.graphql";
import { makeTableColumns } from "./contact.points.base";

// Componente de indicador de estado
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
  const [sortedContacts, setSortedContacts] = useState([]); // Estado para contactos ordenados
  const [orderDirection, setOrderDirection] = useState("desc"); // Estado para manejar la dirección de orden

  // Apollo Client: Obtener todos los puntos de contacto
  const { data, error, loading, refetch } = useQuery(GET_DEFERRED_CONTACT_POINTS);
  const [saveAdminReply] = useMutation(SAVE_ADMIN_REPLY);

  const [getContactById] = useLazyQuery(GET_CONTACT_BY_ID, {
    onCompleted: (data) => {
      console.log(
        "Estado cambiado a Visto para contactID:",
        data.getContactByContactId.contactID
      );
      refetch();
    },
    onError: (error) => {
      console.error("Error al cambiar estado a Visto:", error);
    },
  });

  useEffect(() => {
    if (data) {
      const allContacts = data.getDeferredContactPoints.contacts;
      const contactPoints = allContacts.filter(
        (contact) => contact.status !== "respuesta"
      );

      // Formatear y ordenar los contactos por la fecha más reciente al cargar el componente
      const formattedContacts = contactPoints.map((contact) => {
        const parsedDate = parse(contact.createdAt, "dd/MM/yyyy", new Date());
        return {
          ...contact,
          createdAt: format(parsedDate, "yyyy-MM-dd HH:mm:ss"),
        };
      });

      const sortedByDate = [...formattedContacts].sort((a, b) =>
        compareDesc(new Date(a.createdAt), new Date(b.createdAt))
      );

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

    getContactById({
      variables: {
        contactID: record.contactID,
      },
    });
  };

  const onView = (record) => {
    const response = data.getDeferredContactPoints.contacts.find(
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
          <strong>Estado punto de contacto:</strong> {viewContent.estado}
        </p>
        <br />
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

      {/* Indicadores de estado antes de la tabla y botón de actualización */}
      <div className="flex flex-row justify-between items-center p-4 bg-gray-100">
        <div className="flex">
          <StatusIndicator color="bg-red-500" label="Sin responder" />
          <StatusIndicator color="bg-yellow-500" label="Visto" />
          <StatusIndicator color="bg-green-500" label="Respondido" />
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

      {/* Tabla de puntos de contacto */}
      <main className="flex w-full h-full py-2 overflow-y-auto bg-blue-50">
        <AntTable
          data={sortedContacts}
          columns={makeTableColumns({
            onRespond,
            onView,
            handleSortByDate, // Pasa la función de ordenamiento a las columnas
          })}
        />
      </main>
    </div>
  );
};

export default ContactPoints;
