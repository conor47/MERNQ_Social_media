import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";
import { gql } from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks/hooks";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  // useForm is a custom hook which allows us to modularise our code. This hook takes a callback functino
  // and an initial state and returns to use an object with three Properties. onChange , a function which
  // handles changes in forms input fields. onSubmit , a function which handles the submission of the form. This
  // function calls the callback that was passed to the hook, in this case registerUser. Register use then calls
  // addUser() which executes the mutation. Note we could not pass addUser directly into the custom hook as it
  // was defined below and we cannot move the call to the custom hook below the mutation call as the mutation
  // call requires the fields returned by the value property in the returned object. This is a workaround we found.
  // The final property in the return object is values, which contains the value of each field in the form.

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  // we must specify a variables parameter for the mutation. These are the arguements send with the mutation.
  // In this case we are sending all of our values in the values object so we can simply pass the values object.

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userData } }) {
      context.login(userData);
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

  function registerUser() {
    addUser();
  }

  // We are not performing any validation here on the frontend. Our valdation is done on the backend.

  // useMutation takes a second parameter which is a function that executes when the mutation is succesful.
  // proxy stores some metadata about the mutation, result stores the mutation result

  // We make use of the Form.Input semantic ui component. This essentially combines the input and label elements
  // into one

  // if loading is truthy, ie the mutation has not been resolved yet, then we give our form as classname of
  // loading. This is to enable to loading effect

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email ..."
          name="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
          type="email"
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password ..."
          name="confirmPassword"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
          type="password"
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
