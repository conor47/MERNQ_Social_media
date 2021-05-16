const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      // first we authorise the user

      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty Comment ", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      //  we find the post corresponding to the provided id and use the unshit method to add a comment object to the
      // beginning of the comment array

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        // we must perform a check to see whether the user from the context is the same user who owns the post

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          // note in these error situations we are not returning a payload containing errors becuase this is
          // not information we would ever be presenting to users.Users will never have the option to delete.
          // comments that aren't on their owns posts. This is only to prevent againt a user trying
          // to delete a post through some other means

          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
