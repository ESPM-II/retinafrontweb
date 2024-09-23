import React, { useState, useEffect } from "react";
import { Card, DatePicker, Statistic, Typography, theme } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { LineChart } from "../../components/Charts/LineChart";
import Spinner from "../../components/Loading/Spinner";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS, GET_REGISTER_USERS } from "../../graphql/Queries/Dashboard.graphql";
import { groupByMonth, groupByLast7Days } from "../../utils/utils";
import ContactPointPieChart from "../../components/Charts/ContactPointPieChart"; // Importa el gráfico de torta

const { RangePicker } = DatePicker;
const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Home = () => {
  const { token: { colorLink } } = theme.useToken();
  const valueStyle = { color: colorLink };

  const [rangoFechas, setRangoFechas] = useState([dayjs().startOf("month"), dayjs()]);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [activeUsersLast7Days, setActiveUsersLast7Days] = useState([]);
  const [registeredUsersLast7Days, setRegisteredUsersLast7Days] = useState([]);

  const { loading: loadingActiveUsers, data: activeUsers } = useQuery(GET_ACTIVE_USERS);
  const { loading: loadingRegisteredUsers, data: registeredUsers } = useQuery(GET_REGISTER_USERS);

  useEffect(() => {
    if (activeUsers && registeredUsers) {
      const activeUsersGrouped = groupByMonth(activeUsers.getActiveUsers.users, 'createdAt');
      const registeredUsersGrouped = groupByMonth(registeredUsers.getRegisterUsers.users, 'createdAt');
  
      setActiveUsersData(activeUsersGrouped);
      setRegisteredUsersData(registeredUsersGrouped);

      // Agrupamos para los últimos 7 días
      const activeUsers7Days = groupByLast7Days(activeUsers.getActiveUsers.users, 'createdAt');
      const registeredUsers7Days = groupByLast7Days(registeredUsers.getRegisterUsers.users, 'createdAt');
  
      setActiveUsersLast7Days(activeUsers7Days);
      setRegisteredUsersLast7Days(registeredUsers7Days);
    }
  }, [activeUsers, registeredUsers]);

  if (loadingActiveUsers || loadingRegisteredUsers) {
    return <Spinner tip="Loading Statistics" />;
  }

  // Datos para el gráfico del mes
  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Usuarios Activos",
        data: activeUsersData,
        borderColor: "#1EAF8E",
        backgroundColor: "rgba(30, 175, 142, 0.5)",
      },
      {
        label: "Usuarios Registrados",
        data: registeredUsersData,
        borderColor: "#EDA145",
        backgroundColor: "rgba(237, 161, 69, 0.5)",
      },
    ],
  };

  // Datos para el gráfico de los últimos 7 días
  const chartDataLast7Days = {
    labels: [...Array(7)].map((_, i) => dayjs().subtract(i, 'day').format('DD/MM')).reverse(),
    datasets: [
      {
        label: "Usuarios Activos (últimos 7 días)",
        data: activeUsersLast7Days,
        borderColor: "#1EAF8E",
        backgroundColor: "rgba(30, 175, 142, 0.5)",
      },
      {
        label: "Usuarios Registrados (últimos 7 días)",
        data: registeredUsersLast7Days,
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

        {/* Columna para las tarjetas y el gráfico pequeño */}
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

          {/* Gráfico de los últimos 7 días */}
          <div className="flex items-center w-full h-48 p-2 rounded shadow-sm">
            <LineChart data={chartDataLast7Days} title="Últimos 7 días" />
          </div>
        </div>
      </div>

      {/* Gráfico de torta de tipos de contacto */}
      <div className="mt-5">
        <ContactPointPieChart />
      </div>
    </div>
  );
};

export default Home;
