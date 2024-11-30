import React, { useState, useEffect } from "react";
import { Card, Statistic, Typography, theme } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { LineChart } from "../../components/Charts/LineChart";
import Spinner from "../../components/Loading/Spinner";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS, GET_REGISTER_USERS } from "../../graphql/Queries/Dashboard.graphql";
import { GET_SCHEDULE_LOGS } from "../../graphql/Queries/schedules.graphql";
import ContactPointPieChart from "../../components/Charts/ContactPointPieChart";

const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Home = () => {
  const { token: { colorLink } } = theme.useToken();
  const valueStyle = { color: colorLink };

  const [activeUsersData, setActiveUsersData] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [activeUsersLast7Days, setActiveUsersLast7Days] = useState([]);
  const [registeredUsersLast7Days, setRegisteredUsersLast7Days] = useState([]);
  const [scheduleLogsData, setScheduleLogsData] = useState([]);
  const [scheduleLogsLast7Days, setScheduleLogsLast7Days] = useState([]);

  const { loading: loadingActiveUsers, data: activeUsersDataResponse } = useQuery(GET_ACTIVE_USERS);
  const { loading: loadingRegisteredUsers, data: registeredUsersDataResponse } = useQuery(GET_REGISTER_USERS);
  const { loading: loadingScheduleLogs, data: scheduleLogsResponse } = useQuery(GET_SCHEDULE_LOGS);

  useEffect(() => {
    if (activeUsersDataResponse?.getActiveUsers) {
      const users = activeUsersDataResponse.getActiveUsers.users;
      setActiveUsersData(groupUsersByMonth(users));
      setActiveUsersLast7Days(groupUsersByDay(users));
    }

    if (registeredUsersDataResponse?.getRegisterUsers) {
      const users = registeredUsersDataResponse.getRegisterUsers.users;
      setRegisteredUsersData(groupUsersByMonth(users));
      setRegisteredUsersLast7Days(groupUsersByDay(users));
    }

if (scheduleLogsResponse?.getScheduleLogs) {
      const logs = scheduleLogsResponse.getScheduleLogs;
      setScheduleLogsData(groupSchedulesByMonth(logs));
      setScheduleLogsLast7Days(groupSchedulesByDay(logs));
    }
  }, [activeUsersDataResponse, registeredUsersDataResponse, scheduleLogsResponse]);

  const groupUsersByMonth = (users) => {
    const months = Array(12).fill(0);
    users.forEach(user => {
      const month = dayjs(parseInt(user.createdAt)).month();
      months[month] += 1;
    });
    return months;
  };

  const groupUsersByDay = (users) => {
    const last7Days = [...Array(7)].map((_, i) => dayjs().subtract(i, 'day').format('DD/MM')).reverse();
    const dailyCounts = Array(7).fill(0);

    users.forEach(user => {
      const day = dayjs(parseInt(user.createdAt)).format('DD/MM');
      const index = last7Days.indexOf(day);
      if (index !== -1) {
        dailyCounts[index] += 1;
      }
    });

    return dailyCounts;
  };

  const groupSchedulesByMonth = (logs) => {
    const months = Array(12).fill(0);
    const currentDate = dayjs();

    logs.forEach(log => {
      const logDate = dayjs(parseInt(log.date));
      const diffInMonths = currentDate.diff(logDate, "month");

      if (diffInMonths < 12) {
        const monthIndex = 11 - diffInMonths;
        months[monthIndex] += 1;
      }
    });

    return months;
  };

  const groupSchedulesByDay = (logs) => {
    const last7Days = [...Array(7)].map((_, i) => dayjs().subtract(i, "day").format("DD/MM")).reverse();
    const dailyCounts = Array(7).fill(0);

    logs.forEach(log => {
      const day = dayjs(parseInt(log.date)).format("DD/MM");
      const index = last7Days.indexOf(day);
      if (index !== -1) {
        dailyCounts[index] += 1;
      }
    });

    return dailyCounts;
  };

  if (loadingActiveUsers || loadingRegisteredUsers || loadingScheduleLogs) {
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
        radius: 5,
        hoverRadius: 7,
        borderWidth: 2,
        backgroundColor: "#fff",
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
        tension: 0,
        fill: true,
      },
      {
        label: "Usuarios Registrados",
        data: registeredUsersData,
        borderColor: "#EDA145",
        backgroundColor: "rgba(237, 161, 69, 0.5)",
        tension: 0,
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
        tension: 0,
        fill: true,
      },
      {
        label: "Usuarios Registrados (últimos 7 días)",
        data: registeredUsersLast7Days,
        borderColor: "#EDA145",
        backgroundColor: "rgba(237, 161, 69, 0.5)",
        tension: 0,
        fill: true,
      },
    ],
  };

  const chartDataScheduleLogs = {
    labels: [...Array(12)].map((_, i) => dayjs().subtract(11 - i, "month").format("MMM YYYY")),
    datasets: [
      {
        label: "Agendamientos",
        data: scheduleLogsData,
        borderColor: "#1E90FF",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
        tension: 0,
        fill: true,
      },
    ],
  };

  const chartDataScheduleLogsLast7Days = {
    labels: [...Array(7)].map((_, i) => dayjs().subtract(i, "day").format("DD/MM")).reverse(),
    datasets: [
      {
        label: "Agendamientos (Últimos 7 días)",
        data: scheduleLogsLast7Days,
        borderColor: "#FFA500",
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        tension: 0,
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
              value={activeUsersData.reduce((a, b) => a + b, 0)}
              valueStyle={valueStyle}
              formatter={formatter}
            />
          </Card>

          <Card hoverable bordered={false} className="w-full">
            <Statistic
              title="Usuarios registrados hasta hoy"
              value={registeredUsersData.reduce((a, b) => a + b, 0)}
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

      <div className="flex flex-row flex-wrap lg:flex-nowrap gap-4">
  <div className="w-full lg:w-1/2">
    <LineChart
      data={chartDataScheduleLogs}
      options={chartOptions}
      title="Agendamientos (Últimos 12 meses)"
    />
  </div>
  <div className="w-full lg:w-1/2">
    <LineChart
      data={chartDataScheduleLogsLast7Days}
      options={chartOptions}
      title="Agendamientos (Últimos 7 días)"
    />
  </div>
</div>

    </div>
  );
};

export default Home;
