import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy, result) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      // data.getPosts = data.getPosts.filter((p) => p.id !== postId);
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.deletePost, ...data.getPosts],
        },
      });
      if (callback) callback(); //this is for the situation where a user is deleting a post from the single page view. In this case we want to pass a callback that redirects the user to the home page
    },
    variables: {
      postId,
    },
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen} //we are using semantic Ui's confirm component which acts like a modal to confirm that a user wants to delete the post
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost} // the onConfirm function is the trigger function that was returned from the useMutation hook for actually firing the deltePost mutation.
        // when a user clicks this the post will be deleted
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
