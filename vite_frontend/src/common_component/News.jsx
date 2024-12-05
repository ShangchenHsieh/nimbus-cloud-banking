import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './styling/News.css'; // Import the updated CSS file

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track error state

    // Fetching the news data
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKey = import.meta.env.VITE_NEWS_API_KEY;
                const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`);
                const data = await response.json();
                setArticles(data.articles);
            } catch (error) {
                setError('Error fetching the news. Please try again later.');
                console.error('Error fetching the news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h1>Latest Business News</h1>

                {loading ? (
                    <p className="loading">Loading news...</p>
                ) : error ? (
                    <p className="loading">{error}</p>
                ) : (
                    <ul className="ul">
                        {articles.map((article, index) => (
                            <li key={index} className="li">
                                <h2>{article.title}</h2>
                                <p className="pub-date">
                                    Published on: {new Date(article.publishedAt).toLocaleDateString()}
                                </p>
                                <p><strong>Author:</strong> {article.author || 'Unknown'}</p>
                                <p>{article.description}</p>
                                {article.urlToImage && (
                                    <img src={article.urlToImage} alt={article.title} className="news-image" />
                                )}
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="a">
                                    Read more
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default News;
