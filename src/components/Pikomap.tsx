import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import data from "../data.json";

const Pikomap = () => {
  const mapContainerRef = useRef(null);

  console.log(data);
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxleGFuZHJhZmF6YWthcyIsImEiOiJjbHd5cDgwN2ExZnEzMmtwZzEwcXpsanpkIn0.05GhVKXeuz76H5OvrOjBmg";

    // Initialize map
    const map = new mapboxgl.Map({
      container: "pikomap",
      style:
        "https://tile-1.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/style.json",
      center: [13.847, 51.0221],
      zoom: 10,
    });

    data.features.forEach((sensor) => {
      new mapboxgl.Marker()
        .setLngLat([
          sensor.geometry.coordinates[0],
          sensor.geometry.coordinates[1],
        ])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${sensor.properties.name}</h3><p>Temperature: ${sensor.properties.v} ${sensor.properties.uom}</p><p>Time: ${sensor.properties.time}</p>`
          )
        )
        .addTo(map);
    });

    // Clean up map on unmount
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
