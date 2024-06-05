import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pikomap from "./components/Pikomap";
import TimeSlider from "./components/TimeSlider";
import {
  ChakraProvider,
  Button,
  Flex,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import data from "./data.json";
import { MapboxGeoJSONFeature } from "mapbox-gl";

function generateDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function App() {
  const [selectedDate, setSelectedDate] = useState(
    data.features[0].properties.time
  );
  const [selectedSensorData, setSelectedSensorData] = useState<
    MapboxGeoJSONFeature[]
  >([]);
  const startDate: Date = new Date(data.features[0].properties.time);
  const endDate: Date = new Date(
    data.features[data.features.length - 1].properties.time
  );
  const dates = generateDatesBetween(startDate, endDate);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

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
        {(selectedSensorData.length && (
          <Flex
            justifyContent="space-between"
            alignItems={"center"}
            mt={"20px"}
          >
            <Link mb={"10px"} onClick={() => onOpen()}>
              View data for{" "}
              <Text display={"inline"} fontWeight={"bold"} color={"blue.500"}>
                {selectedSensorData[0].properties?.name}
              </Text>{" "}
            </Link>

            <Button
              onClick={() => {
                map?.setFilter("sensor-points", [
                  "==",
                  ["get", "time"],
                  selectedDate,
                ]);
              }}
            >
              Show All
            </Button>
          </Flex>
        )) ||
          null}

        <Drawer placement={"right"} onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              {selectedSensorData.length &&
                selectedSensorData[0].properties?.name}{" "}
              data
            </DrawerHeader>
            <DrawerBody>
              {selectedSensorData.length &&
                selectedSensorData.map((feature, idx) => {
                  return (
                    <div key={idx}>
                      <Text fontWeight={"bold"}>
                        At {feature.properties?.time.substr(11, 5)}:
                      </Text>
                      <div>
                        <Text>
                          Temperature: {feature.properties?.v}
                          {feature.properties?.uom}
                        </Text>
                        <Text>
                          High: {feature.properties?.hi}
                          {feature.properties?.uom}
                        </Text>
                        <Text>
                          Low: {feature.properties?.lo}
                          {feature.properties?.uom}
                        </Text>
                      </div>
                    </div>
                  );
                })}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <Pikomap
        time={selectedDate}
        setSelectedSensorData={setSelectedSensorData}
        setAppMap={setMap}
        map={map}
      />
    </ChakraProvider>
  );
}

export default App;
