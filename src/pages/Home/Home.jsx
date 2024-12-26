import React, { useState, useEffect } from "react";
import { Card, Statistic, Typography, theme } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { LineChart } from "../../components/Charts/LineChart";
import Spinner from "../../components/Loading/Spinner";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_USERS, GET_REGISTER_USERS, GET_VERIFIED_USERS } from "../../graphql/Queries/Dashboard.graphql";
import { GET_SCHEDULE_LOGS } from "../../graphql/Queries/schedules.graphql";
import ContactPointPieChart from "../../components/Charts/ContactPointPieChart";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);


const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Home = () => {
  const { token: { colorLink } } = theme.useToken();
  const valueStyle = { color: colorLink };
  const [latestLogin, setLatestLogin] = useState("");
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [activeUsersLast7Days, setActiveUsersLast7Days] = useState([]);
  const [registeredUsersLast7Days, setRegisteredUsersLast7Days] = useState([]);
  const [scheduleLogsData, setScheduleLogsData] = useState([]);
  const [scheduleLogsLast7Days, setScheduleLogsLast7Days] = useState([]);
  const [verifiedUsersData, setVerifiedUsersData] = useState([]);
  const [verifiedUsersLast7Days, setVerifiedUsersLast7Days] = useState([]);


  const {
    loading: loadingActiveUsers,
    data: activeUsersDataResponse,
    refetch: refetchActiveUsers,
  } = useQuery(GET_ACTIVE_USERS);
  const {
    loading: loadingRegisteredUsers,
    data: registeredUsersDataResponse,
    refetch: refetchRegisteredUsers,
  } = useQuery(GET_REGISTER_USERS);
  const {
    loading: loadingScheduleLogs,
    data: scheduleLogsResponse,
    refetch: refetchScheduleLogs,
  } = useQuery(GET_SCHEDULE_LOGS);
  const {
    loading: loadingVerifiedUsers,
    data: verifiedUsersDataResponse,
    refetch: refetchVerifiedUsers,
  } = useQuery(GET_VERIFIED_USERS);
  



  useEffect(() => {
    if (!activeUsersDataResponse) {
      refetchActiveUsers();
    }
    if (!registeredUsersDataResponse) {
      refetchRegisteredUsers();
    }
    if (!scheduleLogsResponse) {
      refetchScheduleLogs();
    }
  }, [
    activeUsersDataResponse,
    registeredUsersDataResponse,
    scheduleLogsResponse,
    refetchActiveUsers,
    refetchRegisteredUsers,
    refetchScheduleLogs,
  ]);


  useEffect(() => {
    if (verifiedUsersDataResponse?.getVerifiedUsers) {
      const users = verifiedUsersDataResponse.getVerifiedUsers.users;
  
      // Agrupar por mes y día
      setVerifiedUsersData(groupUsersByMonth(users, "createdAt"));
      setVerifiedUsersLast7Days(groupUsersByDay(users, "createdAt"));
    }
  }, [verifiedUsersDataResponse]);
  
  const verifiedUsersCount = verifiedUsersDataResponse?.getVerifiedUsers?.users.length || 0;

  useEffect(() => {
    if (activeUsersDataResponse?.getActiveUsers) {
      const users = activeUsersDataResponse.getActiveUsers.users;
    
      // Procesar datos de usuarios activos
      setActiveUsersData(groupUsersByMonth(users));
      setActiveUsersLast7Days(groupUsersByDay(users));
    
      // Contar usuarios que han iniciado sesión hasta hoy
      const today = dayjs().startOf("day");
      const activeUsersToday = users.filter(user => dayjs(parseInt(user.lastLogin)).isSame(today, "day")).length;
      setActiveUsersData((prevData) => [...prevData.slice(0, -1), activeUsersToday]); // Actualizar último valor para hoy
    }
    

    if (registeredUsersDataResponse?.getRegisterUsers) {
      const users = registeredUsersDataResponse.getRegisterUsers.users;
  
      // Procesar usuarios registrados por mes y por día
      setRegisteredUsersData(groupUsersByMonth(users, "createdAt"));
      setRegisteredUsersLast7Days(groupUsersByDay(users, "createdAt"));
    }

    if (scheduleLogsResponse?.getScheduleLogs) {
      const { schedules } = scheduleLogsResponse.getScheduleLogs;
  
      // Verificar si schedules es un array
      if (Array.isArray(schedules)) {
        console.log("Datos de agendamientos (schedules):", schedules);
        setScheduleLogsData(groupSchedulesByMonth(schedules));
        setScheduleLogsLast7Days(groupSchedulesByDay(schedules));
      } else {
        console.error("El valor de schedules no es un array:", schedules);
      }
    } else {
      console.warn("No se encontraron datos en getScheduleLogs.");
    }
  }, [scheduleLogsResponse]);

  const groupUsersByMonth = (users) => {
    const months = Array(12).fill(0);
    users.forEach(user => {
      const month = dayjs(parseInt(user.createdAt)).month();
      months[month] += 1;
    });
    return months;
  };

  const groupUsersByDay = (users, dateKey = "lastLogin") => {
    const last7Days = [...Array(7)].map((_, i) => dayjs().subtract(i, "day").format("DD/MM")).reverse();
    const dailyCounts = Array(7).fill(0);
  
    users.forEach((user) => {
      const date = user[dateKey] ? dayjs(parseInt(user[dateKey])).format("DD/MM") : null;
      const index = last7Days.indexOf(date);
      if (index !== -1) {
        dailyCounts[index] += 1;
      }
    });
  
    return dailyCounts;
  };
  
  

  const groupSchedulesByMonth = (logs) => {
    const monthCounts = {}; // Objeto para almacenar el conteo por mes
    const currentDate = dayjs();
  
    logs.forEach(log => {
      const logDate = dayjs(log.date, "DD/MM/YYYY HH:mm:ss", true);
      // Formato correcto
      const diffInMonths = currentDate.diff(logDate, "month");
  
      if (diffInMonths >= 0 && diffInMonths < 12) {
        const monthKey = logDate.format("MMM YYYY"); // Generar clave única para cada mes
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });
  
    // Crear un arreglo con los últimos 12 meses
    const last12Months = [...Array(12)].map((_, i) => {
      const monthKey = currentDate.subtract(11 - i, "month").format("MMM YYYY");
      return monthCounts[monthKey] || 0; // Agregar 0 si no hay datos para ese mes
    });
  
    return last12Months;
  };
  
  const groupSchedulesByDay = (logs) => {
    const last7Days = [...Array(7)].map((_, i) => dayjs().subtract(i, "day").format("DD/MM")).reverse();
    const dailyCounts = Array(7).fill(0);
  
    logs.forEach(log => {
      const day = dayjs(log.date, "DD/MM/YYYY HH:mm:ss", true).format("DD/MM");

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
      {
        label: "Usuarios Verificados",
        data: verifiedUsersData,
        borderColor: "#6A5ACD",
        backgroundColor: "rgba(106, 90, 205, 0.5)",
        tension: 0,
        fill: true,
      },
    ],
  };
  
  const chartDataLast7Days = {
    labels: [...Array(7)].map((_, i) => dayjs().subtract(i, "day").format("DD/MM")).reverse(),
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
      {
        label: "Usuarios Verificados (últimos 7 días)",
        data: verifiedUsersLast7Days,
        borderColor: "#6A5ACD",
        backgroundColor: "rgba(106, 90, 205, 0.5)",
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

          <Card hoverable bordered={false} className="w-full">
          <Statistic
            title="Usuarios verificados hasta hoy"
            value={verifiedUsersCount}
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
