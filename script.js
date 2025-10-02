document.addEventListener("DOMContentLoaded", () => {
  const postsGrid = document.getElementById("postsGrid");

  // posts.json አንብብ
  fetch("posts.json")
    .then((res) => res.json())
    .then((posts) => {
      postsGrid.innerHTML = ""; // ባዶ አድርግ
      posts.forEach((post) => {
        // card ፍጠር
        const card = document.createElement("article");
        card.className = "post-card";

        // image
        const img = document.createElement("img");
        img.src = post.image || "https://via.placeholder.com/400x200?text=No+Image";
        img.alt = post.title || "";
        img.className = "post-thumb";

        // title
        const h3 = document.createElement("h3");
        h3.textContent = post.title || "Untitled";

        // description
        const p = document.createElement("p");
        if (typeof post.description === "object") {
          p.textContent = post.description.am || post.description.en || "";
        } else {
          p.textContent = post.description || "";
        }

        // link
        const a = document.createElement("a");
        a.href = post.link || "#";
        a.textContent = "ይቀጥሉ / Read more";
        a.target = "_blank";
        a.className = "btn small";

        // append
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);
        card.appendChild(a);

        postsGrid.appendChild(card);
      });
    })
    .catch((err) => {
      postsGrid.innerHTML = `<p style="color:red">posts.json ማንበብ አልተሳካም። (${err.message})</p>`;
    });

  // የfooter ዓመት
  document.getElementById("year").textContent = new Date().getFullYear();
});
