import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pikomap from "./components/Pikomap";

function App() {
  const [selectedTime, setSelectedTime] = useState("2024-04-25T00:00Z");

  return (
    <>
      <button
        onClick={() => {
          setSelectedTime("2024-04-27T06:00Z");
        }}
      >
        Change Time
      </button>
      <Pikomap time={selectedTime} />
    </>
  );
}

export default App;
