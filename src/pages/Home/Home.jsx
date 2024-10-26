import React, { useState, useEffect } from "react";
import { Card, DatePicker, Statistic, Typography, theme } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { LineChart } from "../../components/Charts/LineChart";
import Spinner from "../../components/Loading/Spinner";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS, GET_REGISTER_USERS } from "../../graphql/Queries/Dashboard.graphql";
import ContactPointPieChart from "../../components/Charts/ContactPointPieChart";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Home = () => {
  const { token: { colorLink } } = theme.useToken();
  const valueStyle = { color: colorLink };

  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [activeUsersLast7Days, setActiveUsersLast7Days] = useState([]);
  const [registeredUsersLast7Days, setRegisteredUsersLast7Days] = useState([]);

  const { loading: loadingActiveUsers, data: activeUsersDataResponse } = useQuery(GET_ACTIVE_USERS);
  const { loading: loadingRegisteredUsers, data: registeredUsersDataResponse } = useQuery(GET_REGISTER_USERS);

  useEffect(() => {
    if (activeUsersDataResponse && activeUsersDataResponse.getActiveUsers) {
      setActiveUsersCount(activeUsersDataResponse.getActiveUsers.users);

      const dummyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
      setActiveUsersData(dummyData);
      const last7DaysData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20));
      setActiveUsersLast7Days(last7DaysData);
    }

    if (registeredUsersDataResponse && registeredUsersDataResponse.getRegisterUsers) {
      setRegisteredUsersCount(registeredUsersDataResponse.getRegisterUsers.users);

      const dummyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
      setRegisteredUsersData(dummyData);
      const last7DaysData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20));
      setRegisteredUsersLast7Days(last7DaysData);
    }
  }, [activeUsersDataResponse, registeredUsersDataResponse]);

  if (loadingActiveUsers || loadingRegisteredUsers) {
    return <Spinner tip="Loading Statistics" />;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    elements: {
      point: {
        radius: 5, // Tamaño del marcador
        hoverRadius: 7, // Tamaño al pasar el mouse
        borderWidth: 2, // Borde del marcador
        backgroundColor: "#fff", // Color de fondo del marcador
        borderColor: "#1EAF8E", // Color del borde
      },
    },
  };

  const chartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Usuarios Activos",
        data: activeUsersData,
        borderColor: "#1EAF8E",
        backgroundColor: "rgba(30, 175, 142, 0.5)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Usuarios Registrados",
        data: registeredUsersData,
        borderColor: "#EDA145",
        backgroundColor: "rgba(237, 161, 69, 0.5)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartDataLast7Days = {
    labels: [...Array(7)].map((_, i) => dayjs().subtract(i, 'day').format('DD/MM')).reverse(),
    datasets: [
      {
        label: "Usuarios Activos (últimos 7 días)",
        data: activeUsersLast7Days,
        borderColor: "#1EAF8E",
        backgroundColor: "rgba(30, 175, 142, 0.5)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Usuarios Registrados (últimos 7 días)",
        data: registeredUsersLast7Days,
        borderColor: "#EDA145",
        backgroundColor: "rgba(237, 161, 69, 0.5)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-between w-full gap-2 lg:flex-row">
        <Title level={2}>Dashboard</Title>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-4 lg:h-full">
        <div className="flex flex-col items-center w-full h-full p-2 rounded shadow-sm lg:w-2/3">
          <LineChart data={chartData} options={chartOptions} title="Usuarios Activos y Registrados" />
        </div>

        <div className="flex flex-col lg:w-1/3 gap-2">
          <Card hoverable bordered={false} className="w-full">
            <Statistic
              title="Usuarios activos hasta hoy"
              value={activeUsersCount}
              valueStyle={valueStyle}
              formatter={formatter}
            />
          </Card>

          <Card hoverable bordered={false} className="w-full">
            <Statistic
              title="Usuarios registrados hasta hoy"
              value={registeredUsersCount}
              valueStyle={valueStyle}
              formatter={formatter}
            />
          </Card>

          <div className="flex items-center w-full h-48 p-2 rounded shadow-sm">
            <LineChart data={chartDataLast7Days} options={chartOptions} title="Últimos 7 días" />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ContactPointPieChart />
      </div>
    </div>
  );
};

export default Home;
