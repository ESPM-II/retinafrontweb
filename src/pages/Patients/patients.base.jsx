import dayjs from "dayjs";
import faker from "faker";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";


export const makeTableColumns = ({setIsEditingPatient, setIsModalOpen}) => {
  const cols = [
    /* {
      dataIndex: "_id",
      title: "ID",
      // width: 30,
    }, */
    {
      dataIndex: "name",
      title: "Name",
    },
    {
      dataIndex: "lastName",
      title: "LastName",
    },
    {
      dataIndex: "gender",
      title: "Gender",
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      dataIndex: "birthDate",
      title: "Birth Date",
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => (
        <div className="flex flex-row justify-center gap-2 text-center">
          <Tooltip title="Edit Patient">
            <Button
              type="link"
              /* disabled={!hasPermission(3)} */
              onClick={() => {
                setIsEditingPatient(record._id);
                setIsModalOpen(true);
                /* form.setFieldsValue({
                ...record,
                }); */
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete Patient">
            <Popconfirm
              title="Warning!!!"
              description="Do you really want to delete this patient?"
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

export const getFakePatients = () => {
  const fakePatients = Array.from({ length: 10 }, () => ({
    _id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    gender: faker.name.gender({ binary: true }),
    email: faker.internet.email(),
    birthDate: dayjs().format("YYYY-MM-DD"),
  }));
  return fakePatients;
};
