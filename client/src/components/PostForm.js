import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  // we make use of our custom useForm hook for returning a forms values, onChange function and onSubmit function

  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,

    // when we add posts they are not automatically rendered to the screen. To do this we will need ot acces
    // the apollo server cache. Using the proxy we are actually going to be performing graphql queries
    // on the clientside data

    update(proxy, result) {
      //the query we pass here will be performed on the client data stored in the cache
      const data = proxy.readQuery({
        // now all of the data that was in the cache is in the variable 'data'
        query: FETCH_POSTS_QUERY,
      });
      //   data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      }); // now we need to persist the change
      values.body = "";
    },
    onError(err) {
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post :</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && ( // If error is truthy we will render out the error(s) on the page
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
