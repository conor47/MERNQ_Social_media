import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";
import { gql } from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks/hooks";

function Login(props) {
  // we pass our context to the useContext hook and store the returned value in the context variable.
  // This means that we now have access to the data within the context ie the user, the login function and the logout function

  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, values, onSubmit } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  // we must specify a variables parameter for the mutation. These are the arguements send with the mutation.
  // In this case we are sending all of our values in the values object so we can simply pass the values object.

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      // here we are destructuring the result object to get data, then we are destructuring login and giving it an alisa of userData

      context.login(userData); // we call the login function from the context. This will set the user to the user property in the global context.

      props.history.push("/"); // we perform a redirect to the home page if the user is validated

      // We need to implement error handling for our form. We have access to the onError function. We configured
      // our backend such that all errors are stored in the graphQLErrors field
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  // We are not performing any validation here on the frontend. Our valdation is done on the backend.

  function loginUserCallback() {
    loginUser();
  }

  // useMutation takes a second parameter which is a function that executes when the mutation is succesful.
  // proxy stores some metadata about the mutation, result stores the mutation result

  // We make use of the Form.Input semantic ui component. This essentially combines the input and label elements
  // into one

  // if loading is truthy, ie the mutation has not been resolved yet, then we give our form as classname of
  // loading. This is to enable to loading effect

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="username"
          placeholder="Username ..."
          name="username"
          value={values.username}
          error={errors.username ? true : false} // this check allow us to style the field if there is an error relating to that field
          onChange={onChange}
          type="text"
        />
        <Form.Input
          label="Password"
          placeholder="Password ..."
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
          type="password"
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// When rendering our errors above we cannot check if the if the value of errors is truthy as its an empty
// object. This we check if it has any keys. If so then we render our a ul of errors. This are automatically
// styles thanks to semantic ui css by using the classnames ui error message

// defining our register mutation. we use the $syntax when passing variables to the mutations parameters.

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
