import {removeAllPosts, browsePosts, createPosts} from "./utils";
import GhostAdminAPI from "@tryghost/admin-api";

require('dotenv').config();

const api = new GhostAdminAPI({
    url: process.env.CONTENT_URL,
    key: process.env.ADMIN_API_KEY,
    version: 'v2'
  });


removeAllPosts(api);
