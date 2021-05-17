import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

// we perform a check to see if a token exists in local storage. We use the library jwt-decode to decode the
// token so we can perform a check to see if the token has expired yet

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  // we perform the check to see if the token has expired. The value stored in the .exp field of the token is
  // a unix epoch timestamp so we * by 1000 and compare it to the current time.

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

// here we are going to create a context. This will allow us to create a global state in which we can store
// data such as logged in user data to perform authorization checks etc
// This can also be achieved using redux but this application is probably too small for that

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

// we need to create a reducer. A reducer receives an action with a type and a payload and determines what
// what to do with those depending on the functionality of our application

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

// the useReducer hook takes a reducer aand returns a dispatch and a state

// we pass in our reducer we defined above and we also pass an intital state.

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  //   we can now use this dispatch we can dispatch actions and attach to them a type and a payload
  //   when those actions are dispatched our reducer will listen for those actions and then perform any
  //   functionality relating to those actions

  function login(userData) {
    // we are going to store the token in the browsers local storage so that when a user refreshes the page they are
    // not logged out

    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    // when a user logs out (clicks the logout button) we will remove the token form local storage.

    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  }

  // inside the AuthoContext Provider we are specifying what we are going to pass to the components that
  // are below that Context Provider. In this case we are passing a javascript object, hence the double {{}}

  // We are also passing props becuase we might get props from the topdown component
  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
