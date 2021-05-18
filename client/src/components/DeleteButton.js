import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { Button, Confirm, Icon } from "semantic-ui-react";

function DeleteButton({ postId }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
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
