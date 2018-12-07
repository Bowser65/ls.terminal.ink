const express = require('express');
const i18n = require('../static/i18n');
const config = require('../config');

const router = express.Router();

router.get('/', (req, res) => {
  // Send the list of selectable locales
  res.render('lang', {
    to: req.query.to
  });
})
  .get('/:lang', (req, res, next) => {
    if (i18n.getLocales().includes(req.params.lang)) {
      res.cookie('lang', req.params.lang);
      try {
        const url = new URL(config.webserver.location + req.query.to);
        if (url.origin === config.webserver.location) {
          res.redirect(req.query.to);
        } else {
          res.redirect('/');
        }
      } catch (e) {
        res.redirect('/');
      }
    } else {
      next();
    }
  });

module.exports = router;
