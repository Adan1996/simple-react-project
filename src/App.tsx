import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Users, Detail } from "./routes";

function App() {
  return (
    <div className={"app-class"}>
      <Routes>
        <Route path={"/"} element={<Users />} />
        <Route path={"/user/:userId"} element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;
