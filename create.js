import {removeAllPosts, browsePosts, createPosts} from "./utils";
import GhostAdminAPI from "@tryghost/admin-api";

require('dotenv').config();

const api = new GhostAdminAPI({
    url: process.env.CONTENT_URL,
    key: process.env.ADMIN_API_KEY,
    version: 'v2'
  });

// TODO, creating more than about 300 posts causes ghost to hang up, at least when the ghost
// site is backed by sqlite.
createPosts(api, 3000);

