import dayjs from "dayjs";
import { Button, Popconfirm, Tooltip, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export const makeTableColumns = ({ onRespond }) => {
  return [
    {
      dataIndex: "_id",
      title: "ID",
    },
    {
      dataIndex: "contactID",
      title: "Contact ID",
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
        <div className="flex flex-row justify-center gap-2 text-center">
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
        </div>
      ),
    },
  ];
};
