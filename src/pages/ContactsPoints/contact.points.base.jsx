import dayjs from "dayjs";
import faker from "faker";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export const makeTableColumns = ({ setIsEditingContact, setIsModalOpen }) => {
  return [
    {
      dataIndex: "_id",
      title: "ID",
    },
    {
      dataIndex: "contactPointType",
      title: "Tipo de mensaje", // Cambiado a "Paciente" para mayor claridad
    },
    {
      dataIndex: "content", // Corregido el nombre de la propiedad (era "constactText")
      title: "Texto del Mensaje",
      ellipsis: true, // Para mostrar puntos suspensivos si el texto es muy largo
    },
    {
      dataIndex: "createdAt",
      title: "Fecha de Carga",
      render: (dateString) => dayjs(dateString).format("YYYY-MM-DD"), // Formatear la fecha
    },
    {
      key: "actions",
      title: "Acciones",
      render: (record) => (
        <div className="flex flex-row justify-center gap-2 text-center">
          <Tooltip title="Responder Mensaje"> 
            <Button
              type="link"
              onClick={() => {
                setIsEditingContact(record); // Pasar todo el registro al editar
                setIsModalOpen(true);
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>

          <Tooltip placement="topLeft" title="Eliminar Mensaje">
            <Popconfirm
              title="¿Estás seguro de que quieres eliminar este mensaje?" // Mensaje más claro
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => {
                // Aquí va la lógica para eliminar el contacto
                console.log("Eliminar contacto:", record._id); // Ejemplo
              }}
              okText="Sí"
              cancelText="No"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];
};

export const getFakeContacts = (count = 10) => { // Parámetro opcional para la cantidad
  return Array.from({ length: count }, () => ({
    _id: faker.datatype.uuid(),
    patient: faker.name.findName(),
    contactType: faker.random.arrayElement(["Reclamo", "Consulta", "Sugerencia"]),
    contactText: faker.lorem.sentences(2), // Dos oraciones para más realismo
    uploadDate: dayjs(faker.date.past()).format("YYYY-MM-DD"),
  }));
};
