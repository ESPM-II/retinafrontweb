import dayjs from "dayjs";
import faker from "faker";
import React, { useState, useEffect } from 'react'; // Import useEffect here
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { FaRegEye } from "react-icons/fa";


export const makeTableColumns = ({
  setIsEditingCampaign,
  setIsModalOpen,
  setIsPreviewModalOpen,
  refetchCampaigns // Añadimos refetchCampaigns como parámetro
}) => {
  const cols = [
    /* {
      sataIndex: "_id",
      title: "ID",
      // width: 30,
    }, */
    {
      dataIndex: "title",
      title: "Titulo",
      // width: 30
    },
    {
      dataIndex: "description",
      title: "Descripción",
      // width: 30
    },
    {
      dataIndex: "type",
      title: "Tipo de campaña",
    },
    {
      dataIndex: "createdAt",
      title: "Fecha de creación",
    },
    {
      key: "actions",
      title: "Acciones",
      render: (record) => (
        <div className="flex flex-row justify-center gap-2 text-center">
          <Tooltip title="Expandir">
            <Button
              type="link"
              /* disabled={!hasPermission(3)} */
              onClick={() => {
                setIsEditingCampaign(record);
                setIsPreviewModalOpen(true);
                /* form.setFieldsValue({
                ...record,
                }); */
              }}
              icon={<FaRegEye size="1.2em" />}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title="Eliminar">
            <Popconfirm
              title="¡Aviso!"
              description="¿Seguro que quieres borrar esta campaña?"
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

export const CampaingsTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch('http://localhost:4001/graphql', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc5M2Y3N2Q0N2ViOTBiZjRiYTA5YjBiNWFkYzk2ODRlZTg1NzJlZTYiLCJ0eXAiOiJKV1QifQ.DInf6YN_Npf03G9Pe9qhJQmndA5vnQjGFTQ1AFguhnJotWJAgd8VufsFRBEKq1Vn8ZyTOW2ZzWvCTYXVacIHXGO37wd9Gf2g1lWmLPH1IaWiQmOHdNlYKR7kvAP-OFwLG4nVDWPh4Q29YjjBKx3bEKjeAJuVGfTIZWfJvJTrUBPD_U9ayH8T8qyWdj3owwEHtXvUD7K8XFUypHOcPJ0FytMOzKrFrrUB3P4jkGdtgavlDUveMg1ocKoxOokVRUM51vbnSghONAV-XPsTljKTNEeaRCIKm_QJnunRD61Eds3Xmwx7PsxNBxF5XifYthhNE4h8EKLrQ3Uw5UJdHfsX6w' // Replace with your actual token
                  },
                  body: JSON.stringify({
                      query: `
                          query GetCampaigns {
    getCampaigns {
        _id
        title
        description
        image
        createdAt
    }
}
                      `
                  }),
              });

              const responseData = await response.json();
              setCampaigns(responseData.data.getCampaigns);
          } catch (error) {
              console.error("Error fetching data:", error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchData();
  }, []); 

  const columns = makeTableColumns({ 
      setIsEditingCampaign, 
      setIsModalOpen, 
      setIsPreviewModalOpen 
  });

  return (
      <Table 
          dataSource={campaigns} 
          columns={columns} 
          loading={isLoading}
          rowKey="_id" 
      />
  );
};

export const getFakeCampaigns = () => {
  const fakeCampaigns = Array.from({ length: 10 }, () => ({
      _id: faker.datatype.uuid(),
      title: `Campaign ${faker.vehicle.model()}`,
      description: faker.lorem.sentence(5),
      campaignText: faker.lorem.sentence(50),
      campaignType: faker.lorem.sentence(1),
      createDate: dayjs().format("YYYY-MM-DD"),
      startDate: dayjs().format("YYYY-MM-DD"),
      endtDate: dayjs().format("YYYY-MM-DD"),
  }));
  return fakeCampaigns;
};

export default CampaingsTable;

