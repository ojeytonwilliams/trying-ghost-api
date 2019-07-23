import GhostContentAPI from '@tryghost/content-api';
import {argv} from 'yargs';

import {browsePosts, browsePostsByAuthor} from './utils';


require('dotenv').config();

console.log(argv._)
const author = argv._[0] || 'oliver';

const api = new GhostContentAPI({
    url: process.env.CONTENT_URL,
    key: process.env.CONTENT_API_KEY,
    version: 'v2'
  });

//browsePosts(api);
browsePostsByAuthor(api, author);
