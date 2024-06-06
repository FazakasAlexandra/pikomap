import { useEffect, useState } from "react";
import mapboxgl, { MapboxGeoJSONFeature, Map } from "mapbox-gl";
import { FeatureCollection } from "geojson";
import { removeDuplicates } from "../utils/duplicates";
import { formatDate } from "../utils/date";

const useMap = (data: FeatureCollection, date: string) => {
  const [map, setMap] = useState<Map | null>(null);
  // sensor data queried by sensor id and selected date
  const [selectedSensorData, setSelectedSensorData] = useState<
    MapboxGeoJSONFeature[]
  >([]);

  const filterByTimeAndId = (id?: string) => {
    const selectedId = id || selectedSensorData[0].properties?.id;

    map?.setFilter("sensor-points", ["==", ["get", "id"], selectedId]);
    const res = map?.querySourceFeatures("pikodata", {
      sourceLayer: "sensor-points",
      filter: ["==", ["get", "id"], selectedId],
    });

    const sensorData =
      res?.filter((d) => {
        return d.properties?.time.includes(formatDate(new Date(date), true));
      }) || [];
    setSelectedSensorData(removeDuplicates(sensorData));
  };

  const filterByTime = () => {
    map?.setFilter("sensor-points", ["==", ["get", "time"], date]);
    setSelectedSensorData([]);
  };

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

    map.on("load", () => {
      map.addSource("pikodata", {
        type: "geojson",
        data,
      });

      map.addLayer({
        id: "sensor-points",
        type: "heatmap",
        source: "pikodata",
        paint: {
          "heatmap-radius": {
            base: 1.4,
            stops: [
              [10, 2],
              [19, 512],
            ],
          },
        },
      });

      map?.setFilter("sensor-points", ["==", ["get", "time"], date]);

      map.on("click", "sensor-points", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        filterByTimeAndId(e.features[0].properties.id);

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
            return d.properties?.time.includes(
              formatDate(new Date(date), true)
            );
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

      setMap(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  return {
    map,
    setMap,
    selectedSensorData,
    setSelectedSensorData,
    filterByTimeAndId,
    filterByTime,
  };
};

export default useMap;
