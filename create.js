import GhostAdminAPI from "@tryghost/admin-api";
import {argv} from 'yargs';

import {createPosts} from "./utils";

require('dotenv').config();

const count = argv._[0] || 5;

const api = new GhostAdminAPI({
    url: process.env.CONTENT_URL,
    key: process.env.ADMIN_API_KEY,
    version: 'v2'
  });


createPosts(api, count);

// tried 11218 and it seems fine.
