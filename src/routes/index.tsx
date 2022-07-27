import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { Signin } from "../pages/Signin";
import { AppRoutes } from "./app.routes";

function Routes() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}

export { Routes };
