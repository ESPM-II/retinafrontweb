import React, { useState, useEffect } from "react";
import { Card, DatePicker, Statistic, Typography, theme } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { LineChart } from "../../components/Charts/LineChart";
import Spinner from "../../components/Loading/Spinner";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS, GET_REGISTER_USERS } from "../../graphql/Queries/Dashboard.graphql";
import { groupByMonth } from "../../utils/utils";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Home = () => {
  const { token: { colorLink } } = theme.useToken();
  const valueStyle = { color: colorLink };

  const [rangoFechas, setRangoFechas] = useState([dayjs().startOf("month"), dayjs()]);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);

  // Obtener datos de usuarios activos y registrados
  const { loading: loadingActiveUsers, data: activeUsers } = useQuery(GET_ACTIVE_USERS);
  const { loading: loadingRegisteredUsers, data: registeredUsers } = useQuery(GET_REGISTER_USERS);

  useEffect(() => {
    if (activeUsers && registeredUsers) {
      // Agrupar los usuarios activos y registrados usando 'createdAt'
      const activeUsersGrouped = groupByMonth(activeUsers.getActiveUsers.users, 'createdAt');
      const registeredUsersGrouped = groupByMonth(registeredUsers.getRegisterUsers.users, 'createdAt');
  
      setActiveUsersData(activeUsersGrouped);
      setRegisteredUsersData(registeredUsersGrouped);
    }
  }, [activeUsers, registeredUsers]);
  
  if (loadingActiveUsers || loadingRegisteredUsers) {
    return <Spinner tip="Loading Statistics" />;
  }

  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"],
    datasets: [
      {
        label: "Usuarios Activos",
        data: activeUsersData,  // Asegúrate de que contiene datos válidos aquí
        borderColor: "#1EAF8E",
        backgroundColor: "rgba(30, 175, 142, 0.5)",
      },
      {
        label: "Usuarios Registrados",
        data: registeredUsersData,  // Asegúrate de que contiene datos válidos aquí
        borderColor: "#EDA145",
        backgroundColor: "rgba(237, 161, 69, 0.5)",
      },
    ],
  };
  
  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-between w-full gap-2 lg:flex-row">
        <Title level={2}>Dashboard</Title>
      </div>

      {/* Nueva fila para el gráfico y las tarjetas */}
      <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-4 lg:h-full">
        {/* Columna para el gráfico */}
        <div className="flex flex-col items-center w-full h-full p-2 rounded shadow-sm lg:w-2/3">
          <LineChart data={chartData} title="Usuarios Activos y Registrados" />
        </div>

        {/* Columna para las tarjetas */}
        <div className="flex flex-col lg:w-1/3 gap-2">
          <Card hoverable bordered={false} className="w-full">
            <Statistic
              title="Usuarios activos hasta hoy"
              value={activeUsers.getActiveUsers.users.length}
              valueStyle={valueStyle}
              formatter={formatter}
            />
          </Card>

          <Card hoverable bordered={false} className="w-full">
            <Statistic
              title="Usuarios registrados hasta hoy"
              value={registeredUsers.getRegisterUsers.users.length}
              valueStyle={valueStyle}
              formatter={formatter}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
