import React, { useContext } from "react";
import { useQuery } from "@apollo//client";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth"; // we will use the context we created to check whether a user is logged in or not
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

// we write a graphql query for fetching all posts

function Home() {
  const { user } = useContext(AuthContext);
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
        {user && ( // if a user is logged in we want them to have access to a postform form for submitting new posts
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts ...</h1> //we added a transition group below so that there is a small animation
        ) : (
          // when new posts are added
          <Transition.Group>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
