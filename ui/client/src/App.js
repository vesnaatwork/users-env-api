import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cipelica, setCipelica] = useState(false);
  const [dijamant, setDijamant] = useState(false);
  const [responseDetails, setResponseDetails] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3002/purchase", {
        cipelica: cipelica ? "cipelica" : "",
        dijamant: dijamant ? "dijamant" : "",
      });
      setResponseDetails({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });
    } catch (error) {
      if (error.response) {
        setResponseDetails({
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
        });
      } else {
        setResponseDetails({
          status: "Error",
          statusText: "An error occurred",
          headers: {},
          data: error.message,
        });
      }
    }
  };

  return (
    <div className="App">
      <h1>Purchase Form</h1>
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
      {responseDetails && (
        <div className="response-details">
          <h2>Response Details</h2>
          <p>
            <strong>Status:</strong> {responseDetails.status}
          </p>
          <p>
            <strong>Status Text:</strong> {responseDetails.statusText}
          </p>
          <p>
            <strong>Headers:</strong>
          </p>
          <pre>{JSON.stringify(responseDetails.headers, null, 2)}</pre>
          <p>
            <strong>Data:</strong>
          </p>
          <pre>{JSON.stringify(responseDetails.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
