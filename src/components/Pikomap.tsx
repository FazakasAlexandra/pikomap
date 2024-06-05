import { useRef, useEffect, useState } from "react";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";
import data from "../data.json";

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

const Pikomap = ({
  time,
  setSelectedSensorData,
  setAppMap,
  map,
}: {
  time: string;
  setSelectedSensorData: React.Dispatch<
    React.SetStateAction<MapboxGeoJSONFeature[]>
  >;
  setAppMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | null>>;
  map: mapboxgl.Map | null;
}) => {
  const ref = useRef(null);

  useEffect(() => {
    map?.setFilter("sensor-points", ["==", ["get", "time"], time]);
  }, [time]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxleGFuZHJhZmF6YWthcyIsImEiOiJjbHd5cDgwN2ExZnEzMmtwZzEwcXpsanpkIn0.05GhVKXeuz76H5OvrOjBmg";

    const map = new mapboxgl.Map({
      container: "pikomap",
      style:
        "https://tile-1.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/style.json",
      center: [13.847, 51.0221],
      zoom: 10,
    });

    setAppMap(map);

    map.on("load", () => {
      map.addSource("pikodata", {
        type: "geojson",
        data: data as FeatureCollection<Geometry, GeoJsonProperties>,
      });

      map.addLayer({
        id: "sensor-points",
        type: "circle",
        source: "pikodata",
        paint: {
          "circle-radius": 6,
          "circle-color": "#007cbf",
        },
      });

      map?.setFilter("sensor-points", ["==", ["get", "time"], time]);

      map.on("click", "sensor-points", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        map?.setFilter("sensor-points", [
          "==",
          ["get", "id"],
          e.features[0].properties.id,
        ]);

        const res = map.querySourceFeatures("pikodata", {
          sourceLayer: "sensor-points",
          filter: ["==", ["get", "id"], e.features[0].properties.id],
        });

        const sensorData =
          res?.filter((d) => {
            return d.properties?.time.includes(formatDate(new Date(time)));
          }) || [];

        setSelectedSensorData(removeDuplicates(sensorData));

        new mapboxgl.Popup().setLngLat(coordinates).addTo(map);
      });

      map.on("mouseenter", "sensor-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "sensor-points", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }, []);

  return (
    <div
      id="pikomap"
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default Pikomap;
