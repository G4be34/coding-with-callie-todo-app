import { Box, Grid, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { AreaGraph, BarGraph, PieGraph, StackedBarGraph } from "../components/Graphs";


type GraphsDataType = {
  numOfIncomplete: number,
  numOfOverdue: number
};


export const GraphsPage = () => {
  const { numOfIncomplete, numOfOverdue } = useLoaderData() as GraphsDataType;

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
          <BarGraph />
        </Box>
        <Box gridColumn={[1, 1, 2]} gridRow={[2, 2, 1]}>
          <PieGraph />
        </Box>
        <Box gridColumn="1" gridRow={[3, 3, 2]} mb={"auto"} pb={[0, 0, "15%"]}>
          <StackedBarGraph />
        </Box>
        <Box gridColumn={[1, 1, 2]} gridRow={[4, 4, 2]} pb={["20%", "20%", "15%"]} mb={"auto"}>
          <AreaGraph />
        </Box>
      </Grid>
    </Box>
  )
}