import React, { useState, useEffect } from "react";
import { Card, Typography, DatePicker } from "antd";
import { Pie, Line } from "react-chartjs-2";
import { useQuery } from "@apollo/client";
import { GET_ALL_CONTACTS } from "../../graphql/Queries/contactPoints.graphql";
import Spinner from "../../components/Loading/Spinner";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle
);

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ContactPointPieChart = () => {
  const [dataFiltered, setDataFiltered] = useState([]);
  const [rangeDates, setRangeDates] = useState([dayjs().startOf("year"), dayjs()]);
  const [chartData, setChartData] = useState(null);
  const [percentages, setPercentages] = useState({});
  const [lineChartData, setLineChartData] = useState(null);

  const { loading, data } = useQuery(GET_ALL_CONTACTS);

  const filterDataByDate = (contacts, startDate, endDate) => {
    return contacts.filter((contact) => {
      const contactDate = dayjs(contact.createdAt, "DD/MM/YYYY HH:mm:ss");
      return (
        contactDate.isBetween(startDate.startOf("day"), endDate.endOf("day"), null, "[]") &&
        contact.status !== "respuesta"
      );
    });
  };

  const calculateChartData = (contacts) => {
    const contactTypes = {};
    let totalContacts = 0;

    contacts.forEach((contact) => {
      const type = contact.contactPointType;
      contactTypes[type] = (contactTypes[type] || 0) + 1;
      totalContacts++;
    });

    const percentages = {};
    for (const type in contactTypes) {
      percentages[type] = ((contactTypes[type] / totalContacts) * 100).toFixed(2);
    }

    const labels = Object.keys(contactTypes);
    const data = Object.values(contactTypes);
    const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56", "#199276", "#EDA145"];

    return {
      chartData: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors.slice(0, labels.length),
          },
        ],
      },
      percentages,
    };
  };

  const calculateLineChartData = (contacts) => {
    const last7Days = [...Array(7)].map((_, i) =>
      dayjs().subtract(i, "day").format("DD/MM")
    ).reverse();

    const contactCounts = last7Days.map((day) =>
      contacts.filter(
        (contact) => dayjs(contact.createdAt, "DD/MM/YYYY HH:mm:ss").format("DD/MM") === day
      ).length
    );

    return {
      labels: last7Days,
      datasets: [
        {
          label: "Puntos de Contacto (Últimos 7 días)",
          data: contactCounts,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    };
  };

  useEffect(() => {
    if (data && data.getContacts) {
      const filteredContacts = filterDataByDate(
        data.getContacts.contacts,
        rangeDates[0],
        rangeDates[1]
      );

      console.log("Filtered Contacts:", filteredContacts);

      if (filteredContacts.length > 0) {
        const { chartData, percentages } = calculateChartData(filteredContacts);
        const lineData = calculateLineChartData(filteredContacts);

        setChartData(chartData);
        setPercentages(percentages);
        setLineChartData(lineData);
        setDataFiltered(filteredContacts);
      }
    }
  }, [data, rangeDates]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setRangeDates(dates);
    }
  };

  if (loading) {
    return <Spinner tip="Loading data..." />;
  }

  return (
    <div className="flex flex-row gap-4 w-full">
      {/* Gráfico de torta */}
      <div className="w-1/3 p-4">
        <Title level={3}>Tipos de Contacto</Title>
        {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
          <Pie data={chartData} width={150} height={150} />
        ) : (
          <p>No hay datos disponibles</p>
        )}

        <p>
          Mostrando desde el {rangeDates[0].format("DD/MM/YYYY")} hasta el{" "}
          {rangeDates[1].format("DD/MM/YYYY")}
        </p>

        <RangePicker
          value={rangeDates}
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          className="mt-4"
        />
      </div>

      {/* Distribución de puntos de contacto */}
      <div className="w-1/3 p-4">
        <Title level={4}>Distribución de Tipos de Contacto</Title>
        {Object.keys(percentages).map((type, index) => (
          <div key={type} className="flex items-right gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: chartData?.datasets[0]?.backgroundColor[index] || "#000",
              }}
            />
            <p>{type}: {percentages[type]}%</p>
          </div>
        ))}
      </div>

      {/* Gráfico de líneas */}
      <div className="w-1/3 p-4">
        <Title level={3}>Puntos de Contacto (Últimos 7 días)</Title>
        {lineChartData && lineChartData.datasets && lineChartData.datasets.length > 0 ? (
          <Line data={lineChartData} width={250} height={250} />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default ContactPointPieChart;
