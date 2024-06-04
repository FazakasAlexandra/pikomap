import { useState } from "react";
import "./App.css";
import Pikomap from "./components/Pikomap";

function App() {
  const [selectedTime, setSelectedTime] = useState("2024-04-25T00:00Z");

  return (
    <>
      <button
        onClick={() => {
          console.log("change time");
        }}
      >
        Change Time
      </button>
      <Pikomap time={selectedTime} />
    </>
  );
}

export default App;
