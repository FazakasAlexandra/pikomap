import React from "react";
import { Flex, Link, Text, Button } from "@chakra-ui/react";
import { getMonthInfo } from "../utils/date";
import { MapboxGeoJSONFeature, Map } from "mapbox-gl";

interface SelectionInfoProps {
  selectedSensorData: MapboxGeoJSONFeature;
  selectedDate: string;
  onOpen: () => void;
  showAll: () => void;
}

const SelectionInfo: React.FC<SelectionInfoProps> = ({
  selectedSensorData,
  selectedDate,
  onOpen,
  showAll,
}) => {
  const date: Date = new Date(selectedDate);
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mt="20px">
        <Link
          mb="10px"
          onClick={() => {
            onOpen();
          }}
        >
          Selected{" "}
          <Text display="inline" fontWeight="bold" color="blue.500">
            {selectedSensorData.properties?.name}
          </Text>{" "}
          for {date.getDate()} {getMonthInfo(date)}
        </Link>

        <Button
          onClick={() => {
            showAll();
          }}
        >
          Show All
        </Button>
      </Flex>
    </>
  );
};

export default SelectionInfo;
