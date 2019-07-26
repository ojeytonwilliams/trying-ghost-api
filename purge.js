import { removeAllPosts } from './utils';
import GhostAdminAPI from '@tryghost/admin-api';

require('dotenv').config();

const api = new GhostAdminAPI({
  url: process.env.CONTENT_URL,
  key: process.env.ADMIN_API_KEY,
  version: 'v2'
});

// NOTE: for very large databases, it's probably smarter to just use mysql
// directly to remove posts.

removeAllPosts(api);
