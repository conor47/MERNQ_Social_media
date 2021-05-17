import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

// Here we will be performing a check to see if a user is logged in. If a user is logged in we do not want
// them to be able to access to register or login page. We will redirect them back to the home page

// This function takes in a component, which we alias to Component so we can use it as a component later.
// We take in the rest of the arguements using the rest syntax

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest} // we spread whatever was passed by the component that wraps this component
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
