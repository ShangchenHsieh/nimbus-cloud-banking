import "./styling/AboutUs.css";
import Navbar from './Navbar';
import developer from '../assets/developer.png';
import sean from '../assets/sean_edited.jpg'

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
                        {/* Alejandro Pacheco */}
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/alex-pacheco-33299928a/" target="_blank" rel="noopener noreferrer">
                                <img src={developer} alt="Alejandro Pacheco" className="team-img" />
                            </a>
                            <h3 className="team-name">Alejandro Pacheco</h3>
                            <p className="team-role">Full Stack Developer</p>
                            <p className="team-bio">
                                Some things about developer 1
                            </p>
                        </div>

                        {/* Lee Rogers */}
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/lee-rogers-computer-scientist/" target="_blank" rel="noopener noreferrer">
                                <img src={developer} alt="Lee Rogers" className="team-img" />
                            </a>
                            <h3 className="team-name">Lee Rogers</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                Something about developer 2
                            </p>
                        </div>

                        {/* Madison Kolley */}
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/madison-kolley" target="_blank" rel="noopener noreferrer">
                                <img src={developer} alt="Madison Kolley" className="team-img" />
                            </a>
                            <h3 className="team-name">Madison Kolley</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                Something about developer 3
                            </p>
                        </div>

                        {/* Shangchen Hsieh */}
                        <div className="team-member">
                            <a href="https://sean-portfolio-git-main-shangchenhsiehs-projects.vercel.app/" target="_blank" rel="noopener noreferrer">
                                <img src={sean} alt="Shangchen Hsieh" className="team-img" />
                            </a>
                            <h3 className="team-name">Shangchen Hsieh</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                This is our full-stack developer Sean! He is operated by coffee and tea. If you ever have a chance to meet him in person, buy him a coffee!
                            </p>
                        </div>

                        {/* Tanisha Damle */}
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/tanisha-damle" target="_blank" rel="noopener noreferrer">
                                <img src={developer} alt="Tanisha Damle" className="team-img" />
                            </a>
                            <h3 className="team-name">Tanisha Damle</h3>
                            <p className="team-role">Full-stack Developer</p>
                            <p className="team-bio">
                                Something about developer 5
                            </p>
                        </div>

                        {/* Yossef Eini */}
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/yossefeini/" target="_blank" rel="noopener noreferrer">
                                <img src={developer} alt="Yossef Eini" className="team-img" />
                            </a>
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
