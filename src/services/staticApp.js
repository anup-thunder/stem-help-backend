// Provides an App for the static/ directory
const express = require(`express`);
const path = require(`path`);

const { config, logger } = require(`../config`);
const { info } = logger;

const app = express();

const base = {
  apiURL: config.apiURL ?? `http://localhost:${config.staticApp}/v1/`,
};

app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);

// app.engine(`html`, require(`ejs`).renderFile);
app.engine(`.ejs`, require(`ejs`).renderFile);


app
  .get(`/test`, (req, res) => {
    info(`test page has been viewed`);
    res.render(`test`, { ...base });
  });

// TODO: fix this sloppy hack
app.get(`*`, (req, res) => {
  info(`Serving default directory`);
  res.render(path.join(__dirname, `views`, req.path, `index.ejs`), { ...base }, (err, html) => {
    if (err) {
      info(err);
      res.status(404).render(`404`);
    } else {
      res.send(html);
    }
  });
});

module.exports = app;