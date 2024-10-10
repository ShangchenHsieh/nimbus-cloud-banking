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
                    <h2 className="section-title">Meet Our Developer</h2>
                    <div className="team-container">
                        <div className="team-member">
                            <img src={developer} alt="Developer 1" className="team-img" />
                            <h3 className="team-name">Alejandro Pacheco</h3>
                            <p className="team-role">Full Stack Developer</p>
                            <p className="team-bio">
                                Some things about developer 1
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Lee Rogers</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                Something about developer 2
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Madison Kolley</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                Something about developer 3
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Shangchen Hsieh</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                This is our full-stack developer Sean! A fun fact about him, he is operated by coffee and tea. If you ever have a chance to meet him in person, buy him a coffee!
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Tanisha Damle</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                Something about developer 5
                            </p>
                        </div>
                        <div className="team-member">
                            <img src={developer} alt="Developer 2" className="team-img" />
                            <h3 className="team-name">Yossef Eini</h3>
                            <p className="team-role">Full-stack Developer</p>
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
