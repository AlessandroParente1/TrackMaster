import {  Box,  Center,  Flex,  Heading,  Spinner,  useColorModeValue} from "@chakra-ui/react";
import {  ArcElement,  Chart as ChartJS,  Colors,  Legend,  Tooltip,} from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {  BsFillFileTextFill,  BsPersonCheckFill,  BsPersonFill,  BsQuestionLg} from "react-icons/bs";
import ProjectService from "@/services/project-service";
import useApi from "@/hooks/useApi";
import { hexToRgb } from "@/util/Utils";
import StatCard from "../others/StatCard";

// Register Chart.js components necessary for the graphs

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

// Dashboard component to display project statistics and charts

const Dashboard = ({ projectId }) => {
  //stores key project statistics, such as ticket counts.
  const [projectStats, setProjectStats] = useState([]);

  //contain the structured data needed to create pie charts on ticket types and statuses.
  const [ticketTypeChartData, setTicketTypeChartData] = useState(null);
  const [ticketStatusChartData, setTicketStatusChartData] = useState(null);

  //define the icon color and background for various project statistics elements.
  const iconColor = useColorModeValue("white", "white");
  const iconBackgroundColor = [
    "purple.300",
    "green.300",
    "red.300",
    "blue.300",
  ];

  //useApi calls the API via ProjectService.getProjectStats(projectId) to retrieve project statistics using the projectId parameter. projectStatsSWR manages the loading status and contains the received data.
  const projectStatsSWR = useApi(ProjectService.getProjectStats(projectId));

  //transforms statistics data (stat) into an array of objects containing name, icon, background, and value for each statistic (e.g. "Total Tickets", "My Tickets").
  const createStatInfo = (stat) => {
    return [
      {
        name: "Total Tickets",
        icon: BsFillFileTextFill,
        iconBackground: iconBackgroundColor[0],
        iconColor,
        value: stat.ticketCount,
      },
      {
        name: "My Tickets",
        icon: BsPersonFill,
        iconBackground: iconBackgroundColor[1],
        iconColor,
        value: stat.myTicketCount,
      },
      {
        name: "Unassigned Tickets",
        icon: BsQuestionLg,
        iconBackground: iconBackgroundColor[2],
        iconColor,
        value: stat.unassignedTicketCount,
      },
      {
        name: "Assigned Tickets",
        icon: BsPersonCheckFill,
        iconBackground: iconBackgroundColor[3],
        iconColor,
        value: stat.assignedTicketCount,
      },
    ];
  };

  //generates data for a pie chart based on project ticket types:
  const createTicketTypeChartData = (stat) => {
    const data = {
      labels: [],
      datasets: [
        {
          label: "Ticket Type",
          data: [],
          backgroundColor: [],
          borderColor: [],
        },
      ],
    };

    stat.ticketTypeCount.forEach((ticketTypeCountStat) => {

      //pushes ticket type count and colour to the chart data
      data.datasets[0].data.push(ticketTypeCountStat.value);

      const ticketTypeInfo = ticketTypeCountStat.ticketTypeInfo;
      const backgroundColour = hexToRgb(ticketTypeInfo.colour, 1);

      data.labels.push(ticketTypeInfo.name);
      data.datasets[0].backgroundColor.push(backgroundColour);
      data.datasets[0].borderColor.push("rgba(255,255,255,1)");
    });

    return data;
  };

  //Generates data for a pie chart based on project ticket statuses
  const createTicketStatusChartData = (stat) => {
    const data = {
      labels: [],
      datasets: [
        {
          label: "Ticket Status",
          data: [],
          backgroundColor: [],
          borderColor: [],
        },
      ],
    };

    stat.ticketStatusCount.forEach((ticketStatus, index) => {
      data.datasets[0].data.push(ticketStatus.value);
      data.labels.push(ticketStatus._id);

      let backgroundColour;
      //Every ticket has a specific color
      switch (ticketStatus._id) {
        case "Open":
          backgroundColour = hexToRgb("#FBD38D", 1);
          break;
        case "In-Progress":
          backgroundColour = hexToRgb("#90CDF4", 1);
          break;
        case "Done":
          backgroundColour = hexToRgb("#68D391", 1);
          break;
        case "Archived":
          backgroundColour = hexToRgb("#E2E8F0", 1);
          break;
        default:
          backgroundColour = hexToRgb("#FBD38D", 1);
          break;
      }

      data.datasets[0].backgroundColor.push(backgroundColour);
      data.datasets[0].borderColor.push("rgba(255,255,255,1)");
    });

    return data;
  };

  // Update state when project stats are fetched

  useEffect(() => {

    //if projectStatsSWR.data exists/is available
    if (projectStatsSWR.data) {

      //updates projectStats with the data of createStatInfo
      setProjectStats(createStatInfo(projectStatsSWR.data));

      //updates ticketTypeChartData and ticketStatusChartData  with the data for the cake charts
      setTicketTypeChartData(createTicketTypeChartData(projectStatsSWR.data));
      setTicketStatusChartData(
        createTicketStatusChartData(projectStatsSWR.data)
      );
    }
  }, [projectStatsSWR.data]);

  // Show spinner while data is loading

  if (projectStatsSWR.isLoading) {
    return (
      <Center w="100%">
        <Spinner color="blue" size="xl" />
      </Center>
    );
  }
  return (
    <Flex w="100%" direction="column">
      <Flex w="100%" grow="2" justifyContent="space-evenly" gap={3}>
        {projectStats.map((stat, index) => (
          <StatCard {...stat} key={index} />
        ))}
      </Flex>
      <br />

      <Flex h="100%" justifyContent="space-evenly">
        {ticketTypeChartData ? (
          <Box w={400} h={400} align="center">
            <Heading as="h5" size="md">
              Ticket Type
            </Heading>
            <Pie
              data={ticketTypeChartData}
              options={{ plugins: { colors: { enabled: true } } }}
            />
          </Box>
        ) : null}

        {ticketStatusChartData ? (
          <Box w={400} h={400} align="center">
            <Heading as="h5" size="md">
              Ticket Status
            </Heading>
            <Pie
              data={ticketStatusChartData}
              options={{ plugins: { colors: { enabled: true } } }}
            />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default Dashboard;
