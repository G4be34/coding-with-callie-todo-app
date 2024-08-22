import { Box, Grid } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, Tooltip, XAxis, YAxis } from "recharts";


const COLORS = ['gray', 'red', 'orange', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export const GraphsPage = () => {
  const { barChartData, pieChartData, stackedBarChartData, areaChartData } = useLoaderData();

  return (
    <Grid
      templateColumns={"repeat(2, 1fr)"}
      templateRows={"repeat(2, 1fr)"}
      gap={4}
      alignItems={"center"}
      height={"100vh"}
      width={"100vw"}
      overflow={"auto"}
    >
      <Box margin={"auto"} gridColumn="1" gridRow="1">
        <BarChart
          width={400}
          height={300}
          data={barChartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="black" />} />
        </BarChart>
      </Box>
      <Box margin={"auto"} gridColumn="2" gridRow="1">
        <PieChart width={400} height={400}>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Box>
      <Box margin={"auto"} gridColumn="1" gridRow="2">
        <BarChart
          width={400}
          height={300}
          data={stackedBarChartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Normal" fill="gray" stackId={"a"} activeBar={<Rectangle fill="gold" stroke="black" />} />
          <Bar dataKey="High" fill="orange" stackId={"a"} activeBar={<Rectangle fill="gold" stroke="black" />} />
          <Bar dataKey="Highest" fill="red" stackId={"a"} activeBar={<Rectangle fill="gold" stroke="black" />} />
        </BarChart>
      </Box>
      <Box margin={"auto"} gridColumn="2" gridRow="2">
        <AreaChart
          width={400}
          height={300}
          data={areaChartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="Highest" stroke="white" fill="red" stackId={"b"} activeDot={{ r: 8 }} />
          <Area type="monotone" dataKey="High" stroke="white" fill="orange" stackId={"b"} activeDot={{ r: 8 }} />
          <Area type="monotone" dataKey="Normal" stroke="white" fill="gray" stackId={"b"} activeDot={{ r: 8 }} />
        </AreaChart>
      </Box>
    </Grid>
  )
}