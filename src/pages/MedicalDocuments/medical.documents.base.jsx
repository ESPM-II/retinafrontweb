import dayjs from "dayjs";
import faker from "faker";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { IoDocumentsOutline } from "react-icons/io5";
import { v4 } from "uuid";

export const makeTableColumns = ({
  setEditingDocument,
  setIsModalOpen,
  setIsDocumentsModalOpen,
}) => {
  const cols = [
    /* {
      dataIndex: "_id",
      title: "ID",
      // width: 30,
    }, */
    {
      dataIndex: "patient",
      title: "Rut del paciente",
      // width: 30
    },
    {
      dataIndex: "uploadDate",
      title: "Fecha de última carga",
    },
    {
      key: "actions",
      title: "Acciones",
      render: (record) => (
        <div className="flex flex-row justify-center gap-2 text-center">
          <Tooltip title="Show Documents">
            <Button
              type="link"
              /* disabled={!hasPermission(3)} */
              onClick={() => {
                setEditingDocument(record);
                setIsDocumentsModalOpen(true);
                /* form.setFieldsValue({
                ...record,
                }); */
              }}
              icon={<IoDocumentsOutline size="1.2em" />}
            />
          </Tooltip>
          <Tooltip title="Edit Document">
            <Button
              type="link"
              /* disabled={!hasPermission(3)} */
              onClick={() => {
                setEditingDocument(record._id);
                setIsModalOpen(true);
                /* form.setFieldsValue({
                ...record,
                }); */
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete Document">
            <Popconfirm
              title="Warning!!!"
              description="Do you really want to delete this document?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              placement="left"
              onConfirm={() => {
                /* remove({cod_usuario: record.cod_usuario}) */
              }}
              okButtonProps={{ type: "default", danger: true }}
              okText="Si"
              cancelText="No"
            >
              <Button
                danger
                /* disabled={!hasPermission(4)} */
                type="link"
                icon={<DeleteOutlined size="1.5em" />}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];
  return cols;
};

export const getFakeDocuments = () => {
  const fakeDocuments = Array.from({ length: 10 }, () => ({
    _id: faker.datatype.uuid(),
    patient: faker.name.findName(),
    observation: faker.lorem.sentence(5),
    documents: Array.from({ length: Math.random() * (4 - 1) + 1 }, () => ({
      fakeDocId: v4(),
    })),
    gender: faker.name.gender({ binary: true }),
    uploadDate: dayjs().format("YYYY-MM-DD"),
  }));
  return fakeDocuments;
};
