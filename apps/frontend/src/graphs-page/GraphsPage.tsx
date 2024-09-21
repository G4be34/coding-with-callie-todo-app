import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { AreaGraph, BarGraph, PieGraph, StackedBarGraph } from "../components/Graphs";


type GraphsDataType = {
  numOfIncomplete: number,
  numOfOverdue: number
};


export const GraphsPage = () => {
  const { numOfIncomplete, numOfOverdue } = useLoaderData() as GraphsDataType;

  return (
    <Flex flex={1} flexDir={"column"} justifyContent="center" alignItems="center" overflowY={"auto"} pt={4}>
      <Box p={4}>
        <Text fontWeight={"bold"} fontSize={["s", "s", "xl"]}>Incomplete Tasks: {numOfIncomplete}</Text>
        <Text fontWeight={"bold"} fontSize={["s", "s", "xl"]}>Overdue Tasks: {numOfOverdue}</Text>
      </Box>
      <Grid
        width={"100%"}
        height={"90%"}
        templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]}
        templateRows={["repeat(4, auto)", "repeat(4, auto)", "repeat(2, 1fr)"]}
        gap={4}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <Box gridColumn="1" gridRow={[1, 1, 1]} mt={["5%", "5%", 0]} width={["90%", "95%", "95%"]}>
          <BarGraph />
        </Box>
        <Box gridColumn={[1, 1, 2]} gridRow={[2, 2, 1]} width={["90%", "95%", "95%"]}>
          <PieGraph />
        </Box>
        <Box gridColumn="1" gridRow={[3, 3, 2]} mb={"auto"} width={["90%", "95%", "95%"]}>
          <StackedBarGraph />
        </Box>
        <Box gridColumn={[1, 1, 2]} gridRow={[4, 4, 2]} mb={"auto"} width={["90%", "95%", "95%"]}>
          <AreaGraph />
        </Box>
      </Grid>
    </Flex>
  )
}