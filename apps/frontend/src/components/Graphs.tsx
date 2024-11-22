import { Box, Flex, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";


type CustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`${label}`}</p>
        <p className="intro" style={{ color: 'red' }}>{`Highest: ${payload[0] ? payload[0].value : 0}`}</p>
        <p className="intro" style={{ color: 'orange' }}>{`High: ${payload[1] ? payload[1].value : 0}`}</p>
        <p className="intro" style={{ color: 'gray' }}>{`Normal: ${payload[2] ? payload[2].value : 0}`}</p>
      </div>
    );
  }

  return null;
};


export const BarGraph = () => {
  const { barChartData } = useLoaderData() as { barChartData: { week: string, completed: number }[] };
  const [graphType, setGraphType] = useState('bar');

  return (
    <Box bgColor={"rgba(255, 255, 255, 0.2)"} backdropFilter={"blur(10px)"} borderRadius={10} pt={4} pr={4}>
      <Flex justifyContent={"flex-end"} ml={"auto"} alignItems={"center"} maxW={["90%", "70%"]}>
        <Text flex={1} fontWeight={"bold"} fontSize={"xl"} textAlign={"center"} color={"#FFFFFF"}>
          Completed Tasks
        </Text>
        <Select
          cursor={"pointer"}
          variant={"filled"}
          borderRadius={10}
          size={"xs"}
          defaultValue={"bar"}
          maxW={"100px"}
          color={"btnFontColor"}
          bgColor={"buttonBg"}
          onChange={(e) => setGraphType(e.target.value)}
          >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </Select>
      </Flex>

      {graphType === 'bar'
        ? <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={barChartData}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
              <XAxis dataKey="week" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="black" />} />
            </BarChart>
          </ResponsiveContainer>
        : <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={barChartData}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
              <XAxis dataKey="week" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
      }
    </Box>
  )
};


export const PieGraph = () => {
  const { pieChartData } = useLoaderData() as { pieChartData: { name: string, value: number }[] };
  const [graphType, setGraphType] = useState('pie');

  return (
    <Box bgColor={"rgba(255, 255, 255, 0.2)"} backdropFilter={"blur(10px)"} borderRadius={10} pt={4} pr={4}>
      {graphType === 'pie'
        ? <>
            <Select
              cursor={"pointer"}
              variant={"filled"}
              borderRadius={10}
              ml={"auto"}
              size={"xs"}
              defaultValue={"pie"}
              maxW={"100px"}
              color={"btnFontColor"}
              bgColor={"buttonBg"}
              onChange={(e) => setGraphType(e.target.value)}
              >
              <option value="pie">Pie</option>
              <option value="bar">Bar</option>
            </Select>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
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
            </ResponsiveContainer>
            <Text fontWeight={"bold"} color={"white"} fontSize={"xl"} textAlign={"center"}>
              Number of tasks by priority
            </Text>
          </>
        : <>
            <Flex justifyContent={"flex-end"} ml={"auto"} alignItems={"center"} maxW={"90%"}>
              <Text flex={1} fontWeight={"bold"} color={"white"} fontSize={"xl"} textAlign={"center"}>
                Number of tasks by priority
              </Text>
              <Select
                cursor={"pointer"}
                variant={"filled"}
                borderRadius={10}
                size={"xs"}
                defaultValue={"pie"}
                maxW={"100px"}
                color={"btnFontColor"}
                bgColor={"buttonBg"}
                onChange={(e) => setGraphType(e.target.value)}
                >
                <option value="pie">Pie</option>
                <option value="bar">Bar</option>
              </Select>
            </Flex>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={pieChartData}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip />
                <Bar dataKey="value" activeBar={<Rectangle fill="gold" stroke="black" />}>
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'Highest' ? 'red' :
                        entry.name === 'High' ? 'orange' :
                        entry.name === 'Normal' ? 'gray' : '#8884d8'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
      }
    </Box>
  )
};


export const StackedBarGraph = () => {
  const { stackedBarChartData } = useLoaderData() as { stackedBarChartData: { week: string, normal: number, high: number, highest: number }[] };
  const [graphType, setGraphType] = useState('bar');

  return (
    <Box bgColor={"rgba(255, 255, 255, 0.2)"} backdropFilter={"blur(10px)"} borderRadius={10} pt={4} pr={4}>
      <Flex justifyContent={"flex-end"} ml={"auto"} alignItems={"center"} maxW={"90%"}>
        <Text flex={1} fontWeight={"bold"} color={"white"} fontSize={"xl"} textAlign={"center"}>
          Tasks created each week
        </Text>
        <Select
          cursor={"pointer"}
          variant={"filled"}
          borderRadius={10}
          size={"xs"}
          defaultValue={"bar"}
          maxW={"100px"}
          color={"btnFontColor"}
          bgColor={"buttonBg"}
          onChange={(e) => setGraphType(e.target.value)}
          >
          <option value="bar">Bar</option>
          <option value="area">Area</option>
        </Select>
      </Flex>

      {graphType === 'bar'
        ? <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={stackedBarChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Normal" fill="gray" stackId={"a"} activeBar={<Rectangle fill="gray" stroke="black" />} />
              <Bar dataKey="High" fill="orange" stackId={"a"} activeBar={<Rectangle fill="orange" stroke="black" />} />
              <Bar dataKey="Highest" fill="red" stackId={"a"} activeBar={<Rectangle fill="red" stroke="black" />} />
            </BarChart>
          </ResponsiveContainer>
        : <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={stackedBarChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="Highest" stroke="white" fill="red" stackId={"b"} activeDot={{ r: 8 }} />
              <Area type="monotone" dataKey="High" stroke="white" fill="orange" stackId={"b"} activeDot={{ r: 8 }} />
              <Area type="monotone" dataKey="Normal" stroke="white" fill="gray" stackId={"b"} activeDot={{ r: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
      }
    </Box>
  )
};


export const AreaGraph = () => {
  const { areaChartData } = useLoaderData() as { areaChartData: { week: string, Highest: number, High: number, Normal: number }[] };
  const [graphType, setGraphType] = useState('area');

  return (
    <Box bgColor={"rgba(255, 255, 255, 0.2)"} backdropFilter={"blur(10px)"} borderRadius={10} pt={4} pr={4}>
      <Flex justifyContent={"flex-end"} ml={"auto"} alignItems={"center"} maxW={"90%"}>
        <Text flex={1} fontWeight={"bold"} color={"white"} fontSize={"xl"} textAlign={"center"}>
          Task average time to complete
        </Text>
        <Select
          cursor={"pointer"}
          variant={"filled"}
          borderRadius={10}
          size={"xs"}
          defaultValue={"bar"}
          maxW={"100px"}
          color={"btnFontColor"}
          bgColor={"buttonBg"}
          onChange={(e) => setGraphType(e.target.value)}
          >
          <option value="area">Area</option>
          <option value="line">Line</option>
        </Select>
      </Flex>

      {graphType === 'area'
        ? <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={areaChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip content={<CustomTooltip />}/>
              <Legend />
              <Area type="monotone" dataKey="Highest" stroke="white" fill="red" stackId={"b"} activeDot={{ r: 8 }} />
              <Area type="monotone" dataKey="High" stroke="white" fill="orange" stackId={"b"} activeDot={{ r: 8 }} />
              <Area type="monotone" dataKey="Normal" stroke="white" fill="gray" stackId={"b"} activeDot={{ r: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        : <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={areaChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip />
              <Line type="monotone" dataKey="Normal" stroke="gray" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="High" stroke="orange" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Highest" stroke="red" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
      }
    </Box>
  )
};