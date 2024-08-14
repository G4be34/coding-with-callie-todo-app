import { Box, Grid } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, Tooltip, XAxis, YAxis } from "recharts";

export const GraphsPage = () => {
  const { barChartData } = useLoaderData();

  return (
    <Grid
      templateColumns={"repeat(2, 1fr)"}
      templateRows={"repeat(3, 1fr)"}
      gap={4}
      alignItems={"center"}
      height={"100vh"}
      width={"100vw"}
      overflow={"auto"}
    >
      <Box height="auto" margin={"auto"} width="auto" gridColumn="1" gridRow="1">
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
      <Box bg="green" height="100px" margin={"auto"} width="100px" gridColumn="2" gridRow="1" />
      <Box bg="blue" height="100px" margin={"auto"} width="100px" gridColumn="1" gridRow="2" />
      <Box bg="orange" height="100px" margin={"auto"} width="100px" gridColumn="2" gridRow="2" />
      <Box bg="purple" height="100px" margin={"auto"} width="100px" gridColumn="1 / 3" gridRow="3" />
    </Grid>
  )
}