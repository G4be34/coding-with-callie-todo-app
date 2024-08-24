import { Box, Grid, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, Tooltip, XAxis, YAxis } from "recharts";


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


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`${label}`}</p>
        <p className="intro" style={{ color: 'red' }}>{`Highest: ${payload[0].value}`}</p>
        <p className="intro" style={{ color: 'orange' }}>{`High: ${payload[1].value}`}</p>
        <p className="intro" style={{ color: 'gray' }}>{`Normal: ${payload[2].value}`}</p>
      </div>
    );
  }

  return null;
};


export const GraphsPage = () => {
  const { barChartData, pieChartData, stackedBarChartData, areaChartData, numOfIncomplete, numOfOverdue } = useLoaderData();

  return (
    <Box height={"100vh"} width={"100vw"} display="flex" justifyContent="center" alignItems="center" overflowY={"auto"}>
      <Grid
        width={"100%"}
        height={"100%"}
        templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]}
        templateRows={["repeat(4, auto)", "repeat(4, auto)", "repeat(2, 1fr)"]}
        gap={4}
        alignItems={"center"}
        justifyItems={"center"}
        position={"relative"}
        pb={[10, 10, 0]}
        pt={["10%", "10%", 0]}
      >
        <Box pos={"absolute"} top={[5, 5, 10]}>
          <Text fontWeight={"bold"} fontSize={["s", "s", "xl"]}>Incomplete Tasks: {numOfIncomplete}</Text>
          <Text fontWeight={"bold"} fontSize={["s", "s", "xl"]}>Overdue Tasks: {numOfOverdue}</Text>
        </Box>
        <Box gridColumn="1" gridRow={[1, 1, 1]} mt={["5%", "5%", 0]}>
          <Text fontWeight={"bold"} fontSize={"xl"} textAlign={"center"}>Completed Tasks</Text>
          <BarChart
            width={500}
            height={400}
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
        <Box gridColumn={[1, 1, 2]} gridRow={[2, 2, 1]}>
          <PieChart width={300} height={300}>
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
              <Cell key={"normal"} fill={"gray"} />
              <Cell key={"highest"} fill={"red"} />
              <Cell key={"high"} fill={"orange"} />
            </Pie>
            <Tooltip />
          </PieChart>
          <Text fontWeight={"bold"} fontSize={"xl"} textAlign={"center"}>Number of tasks by priority</Text>
        </Box>
        <Box gridColumn="1" gridRow={[3, 3, 2]} mb={"auto"}>
          <Text fontWeight={"bold"} fontSize={"xl"} textAlign={"center"}>Tasks created each week</Text>
          <BarChart
            width={500}
            height={400}
            data={stackedBarChartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Normal" fill="gray" stackId={"a"} activeBar={<Rectangle fill="gray" stroke="black" />} />
            <Bar dataKey="High" fill="orange" stackId={"a"} activeBar={<Rectangle fill="orange" stroke="black" />} />
            <Bar dataKey="Highest" fill="red" stackId={"a"} activeBar={<Rectangle fill="red" stroke="black" />} />
          </BarChart>
        </Box>
        <Box gridColumn={[1, 1, 2]} gridRow={[4, 4, 2]} pb={["20%", "20%", 0]} mb={"auto"}>
          <Text fontWeight={"bold"} fontSize={"xl"} textAlign={"center"}>Task average time to complete</Text>
          <AreaChart
            width={500}
            height={400}
            data={areaChartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip content={<CustomTooltip />}/>
            <Legend />
            <Area type="monotone" dataKey="Highest" stroke="white" fill="red" stackId={"b"} activeDot={{ r: 8 }} />
            <Area type="monotone" dataKey="High" stroke="white" fill="orange" stackId={"b"} activeDot={{ r: 8 }} />
            <Area type="monotone" dataKey="Normal" stroke="white" fill="gray" stackId={"b"} activeDot={{ r: 8 }} />
          </AreaChart>
        </Box>
      </Grid>
    </Box>
  )
}