import "./App.scss";
import { RouterPage } from "./routes/AppRoutes";
import React from "react";
import { Provider } from "react-redux";
import store from "../store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterPage />
      </Provider>
    </>
  );
}

export default App;
