import { LoremIpsum } from "lorem-ipsum";
import moment from "moment";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  },
  random: Math.random
});

export const removeAllPosts = api => {
  remove(api, 1);
};

// TODO This isn't quite deleting everything, as yet.
function remove(api, page = 1, dryrun = false) {
  console.log("removing page", page);

  api.posts.browse({ page, fields: ["id"] }).then(results => {
    results.forEach(post => {
      if (dryrun) {
        console.log("DRY RUN", post);
      } else {
        api.posts.delete(post);
      }
    });
    const pagination = results.meta.pagination;

    if (pagination.next && pagination.next <= pagination.pages) {
      remove(api, page + 1, dryrun);
    }
  });
}

function createSection(text) {
  return JSON.stringify([1, "p", [[0, [], 0, text]]]);
}

function createMultipleSections(texts) {
  return texts.map(createSection).join(",");
}

export const createPosts = (api, n, from = 0, pool = 151) => {
  // mysql has a max_connections (151 by default), so you have to batch post creation.
  const to = Math.min(n - from, pool);
  batchCreate(api, from, to).then(last => {
    if (last < n - 1) {
      createPosts(api, n, last + 1);
    }
  });
};

function batchCreate(api, from, to) {
  // Create array of n promises
  const posts = Array.from({ length: to }, (v, i) => createPost(api, from + i));
  // New promise reports the last post created
  return Promise.all(posts).then(() => from + to - 1);
}

function createPost(api, i) {
  const bodyTexts = lorem.generateParagraphs(7).split("\n");
  return api.posts
    .add({
      title: "My " + i + "th API post",
      status: "published",
      mobiledoc:
        '{"version":"0.3.1","atoms":[],"cards":[],"markups":[],"sections":[' +
        createMultipleSections(bodyTexts) +
        "]}"
    })
    .then(result => {
      console.log("created page", i);
    })
    .catch(reason => {
      console.error("Failed to create post", reason.context);
    });
}

// Note, it needs to be something that new Date() will understand, which format() gives you.
const yesterday = moment()
  .subtract(1, "days")
  .format();
export const browsePosts = api => {
  api.posts
    //  .browse({limit: 5, include: 'tags,authors', filter: `updated_at:>'${yesterday}'`})
    .browse({ limit: 5, include: "tags,authors" })
    .then(posts => {
      posts.forEach(post => {
        //    console.log(post)
        console.log(post.title, post.primary_author);
      });
    })
    .catch(err => {
      console.error(err);
    });
};

export const browsePostsByAuthor = (api, author) => {
  api.posts
    .browse({ limit: 5, include: "tags", filter: `author:${author}` })
    .then(posts => {
      posts.forEach(post => {
        console.log(post)
      // console.log(post.title, post.primary_author);
      });
    })
    .catch(err => {
      console.error(err);
    });
};
