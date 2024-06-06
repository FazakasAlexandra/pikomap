import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Text,
} from "@chakra-ui/react";
import { MapboxGeoJSONFeature } from "mapbox-gl";

interface DrawerProps {
  onClose: () => void;
  isOpen: boolean;
  selectedSensorData: MapboxGeoJSONFeature[];
}

const CustomDrawer: React.FC<DrawerProps> = ({
  onClose,
  isOpen,
  selectedSensorData,
}) => {
  console.log(selectedSensorData);
  return (
    <Drawer placement={"right"} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          {selectedSensorData.length && selectedSensorData[0].properties?.name}{" "}
          data
        </DrawerHeader>
        <DrawerBody>
          {selectedSensorData.length &&
            selectedSensorData.map((feature, idx) => {
              return (
                <div key={idx}>
                  <Text fontWeight={"bold"}>
                    At {feature.properties?.time?.substr(11, 5)}:
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
  );
};

export default CustomDrawer;
