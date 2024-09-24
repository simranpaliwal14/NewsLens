import spacy
from textblob import TextBlob
import mysql.connector
import json

# Load SpaCy NLP model
nlp = spacy.load('en_core_web_sm')

# MySQL Connection Setup
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Admin@123",
    database="news_aggregator"
)

cursor = connection.cursor()

# Fetch articles from the database
cursor.execute("SELECT id, title, description FROM news_articles")
articles = cursor.fetchall()

def process_article(article):
    article_id, title, description = article
    
    if not description or description.strip() == "":
        print(f"Skipping article ID {article_id} due to empty description.")
        return
    
    # Process the description using SpaCy
    doc = nlp(description)
    
    # Analyze sentiment using TextBlob
    sentiment = TextBlob(description).sentiment.polarity
    
    # Categorization logic can be enhanced; here it's just a placeholder
    category = "General"  # Consider adding logic for category determination
    
    # Extract entities using SpaCy
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    
    # Update the article in the database
    cursor.execute(
        "UPDATE news_articles SET sentiment = %s, category = %s, entities = %s WHERE id = %s",
        (sentiment, category, json.dumps(entities), article_id)
    )
    connection.commit()

# Process all articles
for article in articles:
    process_article(article)

print("NLP processing completed.")

# Close the database connection
cursor.close()
connection.close()
