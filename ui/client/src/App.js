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
        date: response.headers.get("Date"),
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

  const handleGetFullCart = async () => {
    try {
      const response = await axios.get("http://localhost:3002/purchase");
      setResponseDetails({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        date: response.headers.get("Date"),
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

  const handleGetLastItem = async () => {
    try {
      const response = await axios.get("http://localhost:3002/purchase/last");
      setResponseDetails({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        date: response.headers.get("Date"),
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

  const handleDeleteLastItem = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3002/purchase/last",
      );
      setResponseDetails({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        date: response.headers.get("Date"),
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

  const handleDeleteCart = async () => {
    try {
      const response = await axios.delete("http://localhost:3002/purchase");
      setResponseDetails({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        date: response.headers.get("Date"),
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
        <label>👠 </label>
      </div>
      <div>
        <input
          type="checkbox"
          checked={dijamant}
          onChange={(e) => setDijamant(e.target.checked)}
        />
        <label>💎 </label>
      </div>
      <div className="button-container">
        <button onClick={handleSubmit}>Send Items</button>
        <button onClick={handleGetLastItem}>Get Last Item</button>
        <button onClick={handleGetFullCart}>Get Full Cart</button>
      </div>
      <div className="button-container-delete">
        <button onClick={handleDeleteLastItem}>
          Remove Last Item from Cart
        </button>
        <button onClick={handleDeleteCart}>Empty Whole Cart</button>
      </div>
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
          {Object.entries(responseDetails.headers).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
          <div className="data-container">
            <p>
              <strong>Data:</strong>
            </p>
            <pre>{JSON.stringify(responseDetails.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
