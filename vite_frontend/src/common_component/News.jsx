import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './styling/News.css'; // Make sure to import the CSS file
import dotenv from 'dotenv';

const News = () => {
    const [articles, setArticles] = useState([]);

    // Fetching the news data
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKey = import.meta.env.VITE_NEWS_API_KEY;
                const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`);
                const data = await response.json();
                setArticles(data.articles);
            } catch (error) {
                console.error('Error fetching the news:', error);
            }
        };
        fetchNews();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h1>Latest News</h1>
                <ul>
                    {articles.length === 0 ? (
                        <p>Loading...</p>
                    ) : (
                        articles.map((article, index) => (
                            <li key={index}>
                                <h2>{article.title}</h2>
                                <p className="pub-date">
                                    Published on: {new Date(article.publishedAt).toLocaleDateString()}
                                </p>
                                <p><strong>Author:</strong> {article.author || 'Unknown'}</p>
                                <p>{article.description}</p>
                                {article.urlToImage && (
                                    <img src={article.urlToImage} alt={article.title} className="news-image" />
                                )}
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    Read more
                                </a>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </>
    );
};

export default News;
