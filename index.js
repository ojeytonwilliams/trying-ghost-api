import GhostContentAPI from '@tryghost/content-api';
import moment from 'moment';

require('dotenv').config();

const yesterday = moment().subtract(1, 'days').valueOf();

const api = new GhostContentAPI({
    url: 'https://olivereytonwilliams.com',
    key: process.env.CONTENT_API,
    version: 'v2'
  });

  // fetch 5 posts, including related tags and authors
  api.posts
      .browse({limit: 5, include: 'tags,authors', filter: 'featured:-true'})
      .then((posts) => {
          posts.forEach((post) => {
           //   console.log(post);

              console.log(post.title, post.featured);
          });
      })
      .catch((err) => {
          console.error(err);
      });
