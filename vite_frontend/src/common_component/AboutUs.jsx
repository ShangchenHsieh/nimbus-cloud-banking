import "./styling/AboutUs.css";
import Navbar from './Navbar';
import developer from '../assets/developer.png'
const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <div className="about-container">
                <section className="why-choose-nimbus">
                    <h2 className="section-title">Why Choose Nimbus Cloud Banking?</h2>
                    <p className="section-description">
                        Nimbus Cloud Banking offers a seamless, secure, and modern approach to banking.
                        With 24/7 accessibility, top-notch security features, and an intuitive user experience,
                        we empower customers to take control of their financial future with ease.
                    </p>
                </section>

                <section className="meet-team">
                    <h2 className="section-title">Meet Our Team</h2>
                    <div className="team-container">
                        <div className="team-member">
                            <img src={developer} alt="Developer 1" className="team-img" />
                            <h3 className="team-name">Developer 1</h3>
                            <p className="team-role">Full Stack Developer</p>
                            <p className="team-bio">
                                Some things about developer 1
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Developer2</h3>
                            <p className="team-role">Frontend Engineer</p>
                            <p className="team-bio">
                                Something about developer 2
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Developer 3</h3>
                            <p className="team-role">Frontend Engineer</p>
                            <p className="team-bio">
                                Something about developer 3
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Developer 4</h3>
                            <p className="team-role">Frontend Engineer</p>
                            <p className="team-bio">
                                Something about developer 4
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Developer 5</h3>
                            <p className="team-role">Frontend Engineer</p>
                            <p className="team-bio">
                                Something about developer 5
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Developer 6</h3>
                            <p className="team-role">Frontend Engineer</p>
                            <p className="team-bio">
                                Something about developer 6
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUs;
