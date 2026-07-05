const addPostBtn = document.getElementById("addPostBtn");
const postInput = document.getElementById("postInput");
const postsDiv = document.getElementById("posts");

addPostBtn.addEventListener("click", () => {
  const postText = postInput.value.trim();
  if (postText === "") {
    alert("Please write something!");
    return;
  }

  // Create post container
  const postDiv = document.createElement("div");
  postDiv.className = "post";

  // Post content
  const postContent = document.createElement("p");
  postContent.textContent = postText;

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Post";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", () => {
    postDiv.remove();
  });

  // Comment section
  const commentSection = document.createElement("div");
  commentSection.className = "comment-section";

  const commentInput = document.createElement("input");
  commentInput.placeholder = "Add a comment...";

  const commentBtn = document.createElement("button");
  commentBtn.textContent = "Add Comment";

  const commentsDiv = document.createElement("div");

  commentBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();
    if (commentText !== "") {
      const comment = document.createElement("div");
      comment.className = "comment";
      comment.textContent = commentText;
      commentsDiv.appendChild(comment);
      commentInput.value = "";
    }
  });

  commentSection.appendChild(commentInput);
  commentSection.appendChild(commentBtn);
  commentSection.appendChild(commentsDiv);

  // Append everything
  postDiv.appendChild(postContent);
  postDiv.appendChild(deleteBtn);
  postDiv.appendChild(commentSection);

  postsDiv.appendChild(postDiv);

  postInput.value = ""; // clear input
});
