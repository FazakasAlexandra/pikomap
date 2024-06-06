import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  SliderMark,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { formatDate, getMonthInfo } from "../utils/date";

interface TimeSliderProps {
  dates: Date[];
  startDate: Date;
  endDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const TimeSlider = ({
  dates,
  startDate,
  endDate,
  setSelectedDate,
}: TimeSliderProps) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleChange = (value: number) => {
    setSliderValue(value);
    setSelectedDate(formatDate(dates[value]));
  };

  return (
    <Flex>
      <Text textAlign={"left"}>{`${getMonthInfo(
        startDate
      )} ${startDate.getFullYear()}`}</Text>
      <Slider
        m={"20px"}
        mt="0"
        defaultValue={0}
        min={0}
        max={dates.length - 1}
        step={1}
        onChange={handleChange}
        position="relative"
      >
        {dates.map((date, index) => (
          <SliderMark
            key={index}
            value={index}
            mt="20px"
            ml="-2.5"
            fontSize="sm"
            color={index === sliderValue ? "blue.500" : "black"}
            fontWeight={index === sliderValue ? "bold" : "normal"}
          >
            {date.getDate()}
          </SliderMark>
        ))}
        <SliderTrack bg="blue.100">
          <SliderFilledTrack bg="blue.500" />
        </SliderTrack>
        <SliderThumb boxSize={6} bg="blue.500" />
      </Slider>
      {(endDate.getFullYear() !== startDate.getFullYear() && (
        <Text textAlign={"center"}>{`${getMonthInfo(
          endDate
        )} ${endDate.getFullYear()}`}</Text>
      )) ||
        null}
    </Flex>
  );
};

export default TimeSlider;
