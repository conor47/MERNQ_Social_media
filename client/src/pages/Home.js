import React from "react";
import { useQuery } from "@apollo//client";
import gql from "graphql-tag";
import { Grid, GridColumn } from "semantic-ui-react";

import PostCard from "../components/PostCard";

// we write a graphql query for fetching all posts

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

function Home() {
  // From the useQuery method we get loading , which is true when the data is loading, and data which contains
  // data. Here we are making a query to our graphql api , fetching all posts.

  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  // We wil display our blogs as a grid, using a semantic ui react grid component.

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts ...</h1>
        ) : (
          data &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
