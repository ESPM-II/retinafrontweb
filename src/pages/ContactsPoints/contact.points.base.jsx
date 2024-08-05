import dayjs from "dayjs";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const StatusIndicator = ({ color }) => (
  <div className="flex items-center">
    <div className={`w-4 h-4 rounded-full ${color}`} />
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case "cerrado":
    case "respuesta":
      return "bg-green-500";
    case "leído":
      return "bg-yellow-500";
    case "enviado":
      return "bg-red-500";
    default:
      return "bg-gray-500"; // Color por defecto si el estado no coincide con ningún caso
  }
};

export const makeTableColumns = ({ onRespond }) => {
  return [
    {
      dataIndex: "_id",
      title: "ID",
    },
    {
      dataIndex: "contactPointType",
      title: "Tipo de mensaje",
    },
    {
      dataIndex: "content",
      title: "Texto del Mensaje",
      ellipsis: true,
    },
    {
      dataIndex: "createdAt",
      title: "Fecha de Carga",
      render: (dateString) => dayjs(dateString).format("YYYY-MM-DD"),
    },
    {
      key: "actions",
      title: "Acciones",
      render: (record) => (
        <div className="flex flex-row justify-center gap-2 items-center">
          <Tooltip title="Responder Mensaje">
            <Button
              type="link"
              onClick={() => onRespond(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Eliminar Mensaje">
            <Popconfirm
              title="¿Estás seguro de que quieres eliminar este mensaje?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => {
                console.log("Eliminar contacto:", record._id);
              }}
              okText="Sí"
              cancelText="No"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
          <StatusIndicator color={getStatusColor(record.status)} />
        </div>
      ),
    },
  ];
};
