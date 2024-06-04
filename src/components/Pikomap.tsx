import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson"; // Import the FeatureCollection type

import "mapbox-gl/dist/mapbox-gl.css";
import data from "../data.json";

const Pikomap = (props: { time: string }) => {
  const mapContainerRef = useRef(null);
  console.log(data);
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

      map.on("click", "sensor-points", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features.find(
          (feature: any) => feature.properties.time === props.time
        ).properties;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `<h3>${properties.name}</h3>
            <p>Temperature: ${properties.v} ${properties.uom}</p>
            <p>Time: ${properties.time}</p>
            <p>High: ${properties.hi} ${properties.uom}</p>
            <p>Low: ${properties.lo} ${properties.uom}</p>`
          )
          .addTo(map);
      });

      map.on("mouseenter", "sensor-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "sensor-points", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div
      id="pikomap"
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default Pikomap;
