import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Icon, Label } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";

function LikeButton({ post: { id, likeCount, likes }, user }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true); // this logic is used to check if a given post has been liked by the user that is logged in and if so we will style the like button differently
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId: id,
    },
  });

  const likeButton = user ? ( // we are using a double ternary. First we check if the user and liked are truthy.
    liked ? ( // if they are then we return filled button. If the user is truthy but liked is not then we return a basic button
      <Button color="teal" filled>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    // This button is returned if a user is not logged in . The button will be a link to the login page
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
