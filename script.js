document.addEventListener("DOMContentLoaded", () => {
  const postsGrid = document.getElementById("postsGrid");

  // posts.json አንብብ
  fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
      postsGrid.innerHTML = "";
      posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "post-card";

        card.innerHTML = `
          <img src="${post.image}" alt="${post.title}" class="post-image"/>
          <div class="post-content">
            <h3>${post.title}</h3>
            <p>${post.description.am}</p>
            <p><em>${post.description.en}</em></p>
            ${
              post.link
                ? `<a href="${post.link}" target="_blank" class="btn small">Read More</a>`
                : ""
            }
          </div>
        `;

        postsGrid.appendChild(card);
      });
    })
    .catch((err) => {
      postsGrid.innerHTML = `<p style="color:red;">Error loading posts: ${err}</p>`;
    });

  // የአመት ዘመን
  document.getElementById("year").textContent = new Date().getFullYear();
});
