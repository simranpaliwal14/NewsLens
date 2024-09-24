const express = require('express');
const axios = require('axios');
const moment = require('moment');
const router = express.Router();
const connection = require('../db/connection');

const NEWS_API_KEY = '3407e7258c564ae29ffb8b7052ddf205'; // Make sure to replace with your actual API key

// Fetch and store news
router.get('/fetch', async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`
    );
    const articles = response.data.articles;

    // Save articles to SQL database
    articles.forEach(article => {
      const { title, url, description, publishedAt, source } = article;
      const formattedDate = moment(publishedAt).format('YYYY-MM-DD HH:mm:ss');
      const sql = `INSERT INTO news_articles (title, url, description, published_at, source) VALUES (?, ?, ?, ?, ?)`;
      connection.query(sql, [title, url, description, formattedDate, source.name], (err) => {
        if (err) throw err;
      });
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching news');
  }
});


// In news.js
// Add a new endpoint to fetch processed articles
router.get('/processed', (req, res) => {
  const sql = `SELECT id, title, description, published_at, source, sentiment, category, entities FROM news_articles`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching processed articles');
      return;
    }
    res.json(results);
  });
});


// Export the router
module.exports = router;


