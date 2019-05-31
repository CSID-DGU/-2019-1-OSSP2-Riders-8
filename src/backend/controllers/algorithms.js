import express from 'express';
import fs from 'fs-extra';
import { execute } from '/common/util';
import webhook from '/common/webhook';
import hierarchy from '/common/hierarchy';
import { NotFoundError } from '/common/error';

const router = express.Router();

const downloadCategories = () => (
  fs.pathExistsSync(hierarchy.path) ?
    execute(`git fetch && git reset --hard origin/master`, { cwd: hierarchy.path }) :
    execute(`git clone https://github.com/algorithm-visualizer/algorithms.git ${hierarchy.path}`)
).then(() => hierarchy.refresh());

downloadCategories().catch(console.error);

webhook.on('algorithms', event => {
  switch (event) {
    case 'push':
      downloadCategories().catch(console.error);
      break;
  }
});

router.route('/')
  .get((req, res, next) => {
    res.json(hierarchy);
  });

router.route('/:categoryKey/:algorithmKey')
  .get((req, res, next) => {
    var ext = '.' + req.query[0];
    const { categoryKey, algorithmKey } = req.params;
    hierarchy.refresh();
    var algorithm = hierarchy.find(categoryKey, algorithmKey);
    showExtFiles(algorithm.files, ext);
    if (!algorithm) return next(new NotFoundError());
    res.json({ algorithm });
  });

router.route('/sitemap.txt')
  .get((req, res, next) => {
    const urls = [];
    hierarchy.iterate((category, algorithm) => {
      urls.push(`https://algorithm-visualizer.org/${category.key}/${algorithm.key}`);
    });
    res.set('Content-Type', 'text/plain');
    res.send(urls.join('\n'));
  });

  function showExtFiles(files, ext) {
    const indexAry = [];
    files.forEach(function(item, index) {
      if (!item.name.includes(ext) && !item.name.includes('.md')) {
        indexAry.push(index);
      }
    });
    var index = 0;
    indexAry.forEach(function(item) {
      var count = item - index;
      files.splice(count, 1);
      index++;
    });
  }

export default router;
