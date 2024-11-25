import Navbar from './Navbar';
import './styling/Contact.css';
import { useState } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
    });

    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await emailjs.send(
                'service_8eqdwgl',
                'template_azh523t',
                formData,
                'NoYqoqezaYRVyyoWV'
            );
            setStatus('Message sent successfully!');
            setFormData({ subject: '', message: '' });
        } catch (error) {
            setStatus('Failed to send message. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="titlebanner" style={{ fontSize: '40px', textAlign: 'center', marginBottom: '30px', marginTop: '2px' }}>
                <h1>Contact Us</h1>
            </div>
            <div className="descriptionbanner"style={{ textAlign: 'center', margin: '10px 0' }}>
                <h2 style={{position: 'relative',padding: '0px',top: '20px',fontSize: '40px',}}>Want to send a message to us?</h2>
                <p style={{position: 'relative',padding: '0px',top: '0px',fontSize: '22px',}}>Fill out the subject and your message below, and it will go directly to our email system.</p>
                <p style={{position: 'relative',padding: '0px',top: '-20px',fontSize: '22px',}}> Please allow up to 48 hours for a reply. We look forward to hearing from you!</p>
            </div>
            {!status.includes('successfully') ? (
                <div className="form-container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <form onSubmit={handleSubmit} className="contact-form" style={{ maxWidth: '400px', width: '100%' }}>
                        <input
                            type="text"
                            name="subject"
                            aria-label="Subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', margin: '10px 0', padding: '10px', fontSize: '16px' }}
                        />
                        <textarea
                            name="message"
                            aria-label="Message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', margin: '10px 0', padding: '10px', fontSize: '16px', height: '150px' }}
                        ></textarea>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                backgroundColor: '#3170e3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <p
                    className="status"
                    style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        fontSize: '20px',
                        color: 'green',
                    }}
                >
                    {status}
                </p>
            )}
        </div>
    );
};

export default Contact;
