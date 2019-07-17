import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    },
    random: Math.random,
  });

export const removeAllPosts = (api) => {
    remove(api, 1);
}


// TODO This isn't quite deleting everything, as yet.
function remove(api, page = 1, dryrun = false) {
    console.log('removing page', page);

    api.posts.browse({page, fields: ['id']}).then(results => {
        results.forEach(post => {
            if(dryrun) {
                console.log('DRY RUN', post)
            } else {
                api.posts.delete(post);
            }

        });
        const pagination = results.meta.pagination;

        if(pagination.next && pagination.next <= pagination.pages) {
            remove(api, page + 1, dryrun);
        }

    })

}

function createSection(text) {
    return JSON.stringify([1,"p",[[0,[],0,text]]]);
}

function createMultipleSections(texts) {
    return texts.map(createSection).join(',');
}

export const createPosts = (api, n, cb) => {

    // TODO use Promise.all to wait for 300 promises to complete, then trigger another 300 and repeat as many times as is needed
    // That's assuming mysql can't cope (the ~300 post limit appeared on sqlite)
    for(let i = 0; i < n; i++) {
        const bodyTexts = lorem.generateParagraphs(7).split('\n');

        api.posts.add({
            title: 'My ' + i + 'th API post',
            status: 'published',
            mobiledoc: '{"version":"0.3.1","atoms":[],"cards":[],"markups":[],"sections":[' + createMultipleSections(bodyTexts) + ']}'
        }).then(result => {
            console.log('created page', i);
        })
        .catch(reason => {
            console.error('Failed to create post', reason)
        });
    }
}



export const browsePosts = (api, fields) => {
    api.posts.browse({fields}).then(results => {
        results.forEach(post => {
            console.log(post)
        })
    })
}
