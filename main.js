const Mercury = require('@postlight/mercury-parser');
const express = require('express');
const TurndownService = require('turndown');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const uuid = require('node-uuid');
const httpContext = require('express-http-context');

const logger = require('./logger');
const header = { 'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' }; // Always set User Agent in Header

var app = express(); // Use express to set up a basic server
app.use(express.json({ limit: '100mb' }));

app.use(httpContext.middleware);
app.use(function(req, res, next) {
    httpContext.set('reqId', uuid.v1());
    next();
});

// React to post on /parse/url
app.post("/mercury/url", async function (req, res) {
    const data = req.body;
    logger.info("Recieved parse request");

    if (!data.url) { // POST didn't have a url
        await logger.error("Post didn't have a url");
        return res.status(400).send({
            error: 1,
            message: "Invalid JSON object"
        });
    }

    await logger.info(`Parsing from url: ${data.url}`);
    let parsed = await Mercury.parse(data.url, { headers: header, contentType: 'html' });
    parsed = await extractTextFromHtml(parsed); // Use turndown and querySelectors to retrieve markdown & plain text
    res.json(parsed);
    await logger.info(`Parsing from url done: ${data.url}`);

});

// React to post on /parse/html
app.post("/mercury/html", async function (req, res) {
    const data = req.body;
    logger.info("Recieved parse request");

    if (!data.url || !data.html) { // POST didn't have url or html
        logger.error("Post didn't have a url or valid html")
        return res.status(400).send({
            error: 1,
            message: "Invalid JSON object"
        });
    }

    logger.info(`Parsing from html: ${data.url}`);
    let parsed = await Mercury.parse(data.url, { headers: header, contentType: 'html', html: data.html });
    parsed = await extractTextFromHtml(parsed);
    res.json(parsed);
    logger.info(`Parsing from html done: ${data.url}`);
});

/**
 * Takes the parsed html and extracts plain text and markdown from it.
 * @param {JSON} parsedJson The parsed json containing a "content" field.
 */
async function extractTextFromHtml(parsedJson) {
    const dom = await new JSDOM(parsedJson.content);
    const md = await new TurndownService();

    await delete parsedJson['content'];
    parsedJson.raw_content = dom.window.document.body.textContent;
    parsedJson.markdown_content = md.turndown(dom.window.document); // Turndown library for markdown

    return parsedJson;
}


app.listen(8080);
logger.info("Launched es-extractor on http://localhost:8080")