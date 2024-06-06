import { useEffect, useState } from "react";
import "./App.css";
import { ChakraProvider, Flex, useDisclosure } from "@chakra-ui/react";
import data from "./data.json";
import { generateDatesBetween } from "./utils/date";
import useMap from "./hooks/useMap";
import { FeatureCollection } from "geojson";

import { Drawer, SelectionInfo, TimeSlider } from "./components";

function App() {
  const startDate: Date = new Date(data.features[0].properties.time);
  const endDate: Date = new Date(
    data.features[data.features.length - 1].properties.time
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dates = generateDatesBetween(startDate, endDate);
  const [selectedDate, setSelectedDate] = useState(
    data.features[0].properties.time
  );
  const { map, selectedSensorData, filterByTime, filterByTimeAndId } = useMap(
    data as FeatureCollection,
    selectedDate
  );

  useEffect(() => {
    if (selectedSensorData.length) {
      filterByTimeAndId();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedSensorData.length) {
      onOpen();
    }
  }, [selectedSensorData]);

  return (
    <ChakraProvider>
      <Flex
        position="absolute"
        zIndex={1}
        backgroundColor={"white"}
        padding={"10px"}
        width={"100%"}
        direction={"column"}
      >
        <TimeSlider
          dates={dates}
          startDate={startDate}
          endDate={endDate}
          setSelectedDate={setSelectedDate}
        />
        {(selectedSensorData.length && map && (
          <SelectionInfo
            showAll={() => filterByTime()}
            selectedSensorData={selectedSensorData[0]} // display mm/dd and sensor name
            selectedDate={selectedDate}
            onOpen={onOpen}
          />
        )) ||
          null}
        <Drawer
          selectedSensorData={selectedSensorData}
          onClose={onClose}
          isOpen={isOpen}
        />
      </Flex>
      <div id="pikomap" style={{ width: "100%", height: "100vh" }} />;
    </ChakraProvider>
  );
}

export default App;
