import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cipelica, setCipelica] = useState(false);
  const [dijamant, setDijamant] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3002/purchase", {
        cipelica: cipelica ? "cipelica" : "",
        dijamant: dijamant ? "dijamant" : "",
      });
      setMessage(response.data);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage("An error occurred");
      }
    }
  };

  return (
    <div className="App">
      <h1>Purchase Form Example for Workshops: </h1>
      <div>
        <input
          type="checkbox"
          checked={cipelica}
          onChange={(e) => setCipelica(e.target.checked)}
        />
        <label>👠 Cipelica</label>
      </div>
      <div>
        <input
          type="checkbox"
          checked={dijamant}
          onChange={(e) => setDijamant(e.target.checked)}
        />
        <label>💎 Dijamant</label>
      </div>
      <button onClick={handleSubmit}>Send</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
