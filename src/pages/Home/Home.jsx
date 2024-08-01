import React, { useRef, useState } from "react";
import { GiMoneyStack } from "react-icons/gi";
import { SiOpenaigym } from "react-icons/si";
import { TbUserCheck, TbUsersGroup } from "react-icons/tb";
import { Divider, Card, DatePicker, Statistic, Typography, theme } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { LineChart } from "../../components/Charts/LineChart";
import { INGRESOS } from "./home.fake";
import Spinner from "../../components/Loading/Spinner";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Home = () => {
  const {
    token: { colorLink },
  } = theme.useToken();

  const valueStyle = {
    color: colorLink,
    display: "flex",
    flexDirection: "row",
    justifyItems: "center",
    justifyContent: "start",
  };

  const [rangoFechas, setRangoFechas] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  /* const { data, isFetching } = useDashboardInfo(
    dayjs(rangoFechas[0]).format("YYYY-MM-DD"),
    dayjs(rangoFechas[1]).format("YYYY-MM-DD"),
  ); */

  const data = undefined;

  const isFetching = false;

  const { ingresos, pagos } = data ? data : [];

  const { estadisticas } = data ? data : {};

  const g1Ref = useRef(null);
  const g2Ref = useRef(null);

  // export image
  const downloadImage = (ref) => {
    ref.current?.downloadImage();
  };

  if (isFetching) {
    return <Spinner tip="Loading Statistics" />;
  }

  return (
    <div className="flex flex-col w-full h-full gap-2 p-4 overflow-y-auto">
      <div className="flex flex-col items-center justify-between w-full gap-2 lg:flex-row">
        <Title level={2}>Dashboard</Title>
        <RangePicker
          value={rangoFechas}
          format="DD-MM-YYYY"
          onChange={setRangoFechas}
        />
      </div>
      {/* Graficos */}
      <div className="flex flex-col w-full gap-2 lg:flex-row lg:h-full">
        {/* Chart 1 Patients */}
        <div className="flex flex-col items-center w-full h-full p-2 rounded shadow-sm lg:w-1/2">
          <LineChart
            data={INGRESOS}
            chartRef={g1Ref}
            title="Patients"
          />
        </div>
        {/* Chart 2 Pagos */}
        <div className="flex flex-col items-center w-full h-full p-2 rounded shadow-sm lg:w-1/2">
          <LineChart
            data={[]}
            chartRef={g2Ref}
            title="Orders Entry"
          />
        </div>
      </div>
      {/* Statistics */}
      <div className="flex flex-col gap-2 mt-2 lg:flex-row">
        <Card hoverable bordered={false} className="w-full lg:w-1/2">
          <Statistic
            title="Stat 1"
            value={[]}
            // precision={2}
            valueStyle={valueStyle}
            prefix={<TbUsersGroup size="1.5em" />}
            // suffix="%"
            formatter={formatter}
          />
        </Card>
        <Card hoverable bordered={false} className="w-full lg:w-1/2">
          <Statistic
            title="Stat 2"
            value={[]}
            // precision={2}
            valueStyle={valueStyle}
            prefix={<TbUserCheck size="1.5em" />}
            formatter={formatter}
            // suffix="%"
          />
        </Card>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row">
        <Card hoverable bordered={false} className="w-full lg:w-1/2">
          <Statistic
            title="Stat 3"
            value={[]}
            // precision={0}
            valueStyle={valueStyle}
            prefix={<GiMoneyStack size="1.5em" />}
            formatter={formatter}
            suffix="CLP"
          />
        </Card>
        <Card hoverable bordered={false} className="w-full lg:w-1/2">
          <Statistic
            title="Stat 2"
            value={[]}
            // precision={2}
            valueStyle={valueStyle}
            prefix={<SiOpenaigym size="1.5em" />}
            formatter={formatter}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;
