import React, { useState, useEffect } from "react";
import { Card, Typography, DatePicker } from "antd";
import { Pie } from "react-chartjs-2";
import { useQuery } from "@apollo/client";
import { GET_DEFERRED_CONTACT_POINTS } from "../../graphql/Queries/contactPoints.graphql";
import Spinner from "../../components/Loading/Spinner";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; // Plugin para usar isBetween
import customParseFormat from "dayjs/plugin/customParseFormat"; // Plugin para parsear formatos personalizados

dayjs.extend(isBetween); // Extiende dayjs para habilitar isBetween
dayjs.extend(customParseFormat); // Extiende dayjs para manejar formatos personalizados

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ContactPointPieChart = () => {
  const [dataFiltered, setDataFiltered] = useState([]);
  const [rangeDates, setRangeDates] = useState([dayjs().startOf('year'), dayjs()]);
  const [chartData, setChartData] = useState(null); // Inicializamos en null para verificar luego
  const [percentages, setPercentages] = useState({});
  
  // Query para obtener los puntos de contacto diferidos
  const { loading, data } = useQuery(GET_DEFERRED_CONTACT_POINTS);
  
  // Filtrar los datos según el rango de fechas seleccionado
  const filterDataByDate = (contacts, startDate, endDate) => {
    return contacts.filter(contact => {
      const contactDate = dayjs(contact.createdAt, "DD/MM/YYYY HH:mm:ss"); // Aseguramos el formato correcto
      return contactDate.isBetween(startDate, endDate, null, "[]") && contact.status !== "respuesta";
    });
  };

  // Calcular los datos para el gráfico de torta
  const calculateChartData = (contacts) => {
    const contactTypes = {};
    let totalContacts = 0;
    
    contacts.forEach(contact => {
      const type = contact.contactPointType;
      if (!contactTypes[type]) {
        contactTypes[type] = 0;
      }
      contactTypes[type]++;
      totalContacts++;
    });
    
    // Calcular porcentajes
    const percentages = {};
    for (const type in contactTypes) {
      percentages[type] = ((contactTypes[type] / totalContacts) * 100).toFixed(2);
    }

    // Generar los datos para el gráfico
    const labels = Object.keys(contactTypes);
    const data = Object.values(contactTypes);
    const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56", "#199276", "#EDA145"];
    
    return {
      chartData: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors.slice(0, labels.length), // Ajustar los colores a los tipos de contacto
          },
        ],
      },
      percentages,
    };
  };

  // Actualizar los datos cada vez que cambie el rango de fechas o los datos de la query
  useEffect(() => {
    if (data && data.getDeferredContactPoints) {
      const filteredContacts = filterDataByDate(data.getDeferredContactPoints.contacts, rangeDates[0], rangeDates[1]);
      const { chartData, percentages } = calculateChartData(filteredContacts);
      setChartData(chartData);
      setPercentages(percentages);
      setDataFiltered(filteredContacts);
    }
  }, [data, rangeDates]);

  // Manejar la selección de rango de fechas
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setRangeDates(dates);
    }
  };

  if (loading) {
    return <Spinner tip="Loading data..." />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 w-full">
      {/* Gráfico de torta */}
      <div className="flex flex-col items-center lg:w-1/4 p-4 rounded shadow-sm">
        <Title level={2}>Tipos de Contacto</Title>
        {chartData && chartData.datasets ? (
          <Pie data={chartData} />
        ) : (
          <p>No data available</p>
        )}
        
        {/* Mostrar el rango de fechas */}
        <p>
          Mostrando desde el {rangeDates[0].format("DD/MM/YYYY")} hasta el {rangeDates[1].format("DD/MM/YYYY")}
        </p>

        {/* Selector de rango de fechas */}
        <RangePicker
          value={rangeDates}
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          className="mt-4"
        />
      </div>

      {/* Porcentajes y colores */}
      <div className="flex flex-col lg:w-1/3 p-4">
        <Title level={3}>Distribución de Tipos de Contacto</Title>
        {Object.keys(percentages).map((type, index) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-5 h-4 rounded-full"
              style={{ backgroundColor: chartData?.datasets[0]?.backgroundColor[index] || "#000" }}
            />
            <p>{type}: {percentages[type]}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPointPieChart;
