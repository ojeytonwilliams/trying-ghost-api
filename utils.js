import { LoremIpsum } from 'lorem-ipsum';
import moment from 'moment';
import { shuffle } from 'lodash';

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
  remove(api);
};

// This looks a bit odd, but the main reason is that batch deletion is unsafe (multiple things get updated
// in a single delete call).  Hence we look for the next post, delete it and repeat (each time deleting
// a different next post)
function remove (api) {
  api.posts.browse({ fields: ['id'], limit: 1 }).then(results => {
    api.posts.delete(results[0]).then(() => {
      const pagination = results.meta.pagination;

      if (pagination.next && pagination.next <= pagination.pages) {
        remove(api);
      }
    }
    ).catch(err => {
      console.log(err);
    });
  });
}

function createSection (text) {
  return [1, 'p', [[0, [], 0, text]]];
}

function createMultipleSections (texts) {
  return texts.map(createSection);
}

// NOTE pool is currently set at one, not because the db can't cope, but because
// (I think) it's still updating tags when a new post POST comes in and it it's locked.
export const createPosts = (api, n, from = 0, pool = 1) => {
  // mysql has a max_connections (151 by default), so you have to batch post creation.
  const to = Math.min(n - from, pool);
  batchCreate(api, from, to).then(last => {
    if (last < n - 1) {
      createPosts(api, n, last + 1);
    }
  });
};

function batchCreate (api, from, to) {
  // Create array of n promises
  const posts = Array.from({ length: to }, (v, i) => createPost(api, from + i));
  // New promise reports the last post created
  return Promise.all(posts).then(() => from + to - 1);
}

function createPost (api, i) {
  const bodyTexts = lorem.generateParagraphs(7).split('\n');
  const mobiledoc = createMobiledoc();
  mobiledoc.sections = createMultipleSections(bodyTexts);
  const tags = ['js', 'css', 'html', 'maths', 'coding', 'github', 'node', 'fcc', 'devops', 'git', 'life',
    'tools'];
  const tagsUsed = randomTags(tags, 5);
  // const tagsUsed = ["debug"]

  return api.posts
    .add({
      title: 'My ' + i + 'th API post',
      status: 'published',
      mobiledoc: JSON.stringify(mobiledoc),
      tags: tagsUsed
    })
    .then(result => {
      console.log('created page', i);
      console.log('with tags', tagsUsed);
    })
    .catch(reason => {
      console.error('Failed to create post', reason);
    //  console.error("Failed to create post", reason.code, reason.context)
    });
}

function createMobiledoc () {
  const template = {
    version: '0.3.1',
    atoms: [],
    cards: [],
    markups: [],
    sections: []
  };
  return { ...template };
}

// Note, it needs to be something that new Date() will understand, which format() gives you.
// const yesterday = moment()
//   .subtract(1, "days")
//   .format();
export const browsePosts = api => {
  api.posts
    //  .browse({limit: 5, include: 'tags,authors', filter: `updated_at:>'${yesterday}'`})
    .browse({ limit: 5, include: 'tags,authors' })
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
    .browse({ limit: 5, include: 'tags', filter: `author:${author}` })
    .then(posts => {
      posts.forEach(post => {
        console.log(post);
      // console.log(post.title, post.primary_author);
      });
    })
    .catch(err => {
      console.error(err);
    });
};

/* Returns 0 to max tags in a random order */
function randomTags (tags, max = 5) {
  return shuffle(tags).slice(0, Math.random() * (1 + Math.min(tags.length, max)));
}
