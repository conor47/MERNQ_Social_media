import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  // we are making our mutation dynamic. If a commentId has been passed then we know that the deleteButton is being used to delete a comment. In that case
  // we skip the portion of the code that updates the posts in the cache.

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy, result) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        // data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: [result.data.deletePost, ...data.getPosts], // this is the line that caused some trouble. Look into understanding this. The problem had to do with trying to mutatate an immutable object returned by
          },
        });
      }
      if (callback) callback(); //this is for the situation where a user is deleting a post from the single page view. In this case we want to pass a callback that redirects the user to the home page
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete Post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>

      <Confirm
        open={confirmOpen} //we are using semantic Ui's confirm component which acts like a modal to confirm that a user wants to delete the post
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation} // the onConfirm function is the trigger function that was returned from the useMutation hook for actually firing the deltePost mutation.
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

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
