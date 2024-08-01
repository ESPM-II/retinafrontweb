import faker from "faker";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";


export const makeTableColumns = ({setIsEditingUser, setIsModalOpen}) => {
  const cols = [
    /* {
      dataIndex: "_id",
      title: "ID",
      // width: 30,
    }, */
    {
      dataIndex: "username",
      title: "User Name",
    },
    {
      dataIndex: "fullName",
      title: "Full Name",
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      dataIndex: "phoneNumber",
      title: "Phone Number",
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => (
        <div className="flex flex-row justify-center gap-2 text-center">
          <Tooltip title="Edit User">
            <Button
              type="link"
              /* disabled={!hasPermission(3)} */
              onClick={() => {
                setIsEditingUser(record._id);
                setIsModalOpen(true);
                /* form.setFieldsValue({
                ...record,
                }); */
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete User">
            <Popconfirm
              title="Warning!!!"
              description="Do you really want to delete this user?"
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

export const getFakeUsers = () => {
  const fakeUsers = Array.from({ length: 10 }, () => ({
    _id: faker.datatype.uuid(),
    username: `${faker.name.firstName()[0].toLowerCase()}.${faker.name.lastName().toLowerCase()}`,
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
  }));
  return fakeUsers;
};
