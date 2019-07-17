import GhostContentAPI from '@tryghost/content-api';
import moment from 'moment';

require('dotenv').config();

// Note, it needs to be something that new Date() will understand, which format() gives you.
const yesterday = moment().subtract(1, 'days').format();

const api = new GhostContentAPI({
    url: process.env.CONTENT_URL,
    key: process.env.CONTENT_API_KEY,
    version: 'v2'
  });

  // fetch 5 posts, including related tags and authors
  api.posts
      .browse({limit: 5, include: 'tags,authors', filter: `updated_at:>'${yesterday}'`})
      .then((posts) => {
          posts.forEach((post) => {
            //  console.log(post)
            console.log(post.title, post.featured);
          });
      })
      .catch((err) => {
          console.error(err);
      });
