const posts = require("../db/db.json");
const path = require("path");

const index = (req, res) => {
  res.format({
    html: () => {
      let html = "<ul>";
      posts.forEach((post) => {
        html += `<li>
                    <div>
                        <a href="http://localhost:3000/posts/${post.slug}">
                            <h3>${post.title}</h3></a>
                            <img width="200" src=${`/${post.image}`} />
                            <p><strong>Ingredienti</strong>: ${post.tags
                              .map((t) => `<span class="tag">${t}</span>`)
                              .join(", ")}</p>
                    </div>
                </li>`;
      });
      html += "</ul>";
      res.send(html);
    },
    json: () => {
      res.json({
        data: posts,
        count: posts.length,
      });
    },
  });
};

const show = (req, res) => {
  const slugPostsRequest = req.params.slug;
  const postRequest = posts.find((post) => post.slug === slugPostsRequest);
  res.format({
    html: () => {
      if (postRequest) {
        const post = postRequest;
        res.send(`
                    <div>
                        <h3>${post.title}</h3>
                        <img width="200" src=${`/${post.image}`} />
                        <p><strong>Ingredienti</strong>: ${post.tags
                          .map((t) => `<span class="tag">${t}</span>`)
                          .join(", ")}</p>
                    </div>
                `);
      } else {
        res.status(404).send(`<h1>Post non trovato</h1>`);
      }
    },
    json: () => {
      if (postRequest) {
        res.json({
          ...postRequest,
          image_url: `http://${req.headers.host}/${postRequest.image}`,
        });
      } else {
        res.status(404).json({
          error: "Not Found",
          description: `Non esiste una pizza con slug ${slugPostsRequest}`,
        });
      }
    },
  });
};

const create = (req, res) => {
  res.format({
    html: () => {
      res.send("<h1>Creazione nuovo post</h1>");
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    },
  });
};

const download = (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (post) {
    const filePath = path.join(__dirname, "..", "public", post.image);
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
};

module.exports = { index, show, create, download };
