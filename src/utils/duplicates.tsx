import { MapboxGeoJSONFeature } from "mapbox-gl";

function removeDuplicates(array: MapboxGeoJSONFeature[]) {
  const uniqueTimes = new Set();

  // Filter the array to include only objects with unique time values
  const uniqueData = array.filter((obj) => {
    // Extract the time value from each object
    const time = obj.properties?.time;
    // Check if the time value is already in the Set
    if (uniqueTimes.has(time)) {
      // If it is, return false to exclude the object
      return false;
    } else {
      // If it's not, add the time value to the Set and return true to include the object
      uniqueTimes.add(time);
      return true;
    }
  });
  return uniqueData;
}

export { removeDuplicates };
