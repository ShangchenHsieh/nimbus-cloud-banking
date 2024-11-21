import "./styling/AboutUs.css";
import Navbar from "./Navbar";
import developer from "../assets/developer.png";
import lee from "../assets/lr_pfp.png";
import sean from "../assets/sean.jpg";

const AboutUs = () => {
   return (
      <div>
         <Navbar />
         <div className="about-container">
            <section className="why-choose-nimbus">
               <h2 className="section-title">
                  Why Choose Nimbus Cloud Banking?
               </h2>
               <p className="section-description">
                  Nimbus Cloud Banking offers a seamless, secure, and modern
                  approach to banking. With 24/7 accessibility, top-notch
                  security features, and an intuitive user experience, we
                  empower customers to take control of their financial future
                  with ease.
               </p>
            </section>

            <section className="meet-team">
               <h2 className="section-title">Meet Our Developers</h2>
               <div className="team-container">
                  {/* Alejandro Pacheco */}
                  <div className="team-member">
                     <a
                        href="https://www.linkedin.com/in/alex-pacheco-33299928a/"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <img
                           src={developer}
                           alt="Alejandro Pacheco"
                           className="team-img"
                        />
                     </a>
                     <h3 className="team-name">Alejandro Pacheco</h3>
                     <p className="team-role">Full Stack Developer</p>
                     <p className="team-bio">
                        Alejandro is a skilled full-stack developer with expertise in React
                        and Node.js. Passionate about building scalable web applications.
                     </p>
                     <div className="social-icons">
                        <a
                           href="https://www.linkedin.com/in/alex-pacheco-33299928a/"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="icon linkedin"
                        >
                           <i className="fab fa-linkedin"></i>
                        </a>
                     </div>
                  </div>

                  {/* Lee Rogers */}
                  <div className="team-member">
                     <a
                        href="https://www.linkedin.com/in/lee-rogers-computer-scientist/"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <img src={lee} alt="Lee Rogers" className="team-img" />
                     </a>
                     <h3 className="team-name">Lee Rogers</h3>
                     <p className="team-role">Full-stack Developer</p>
                     <p className="team-bio">
                        Lee specializes in computer science and mathematics, focusing on
                        algorithm optimization and backend development.
                     </p>
                     <div className="social-icons">
                        <a
                           href="https://www.linkedin.com/in/lee-rogers-computer-scientist/"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="icon linkedin"
                        >
                           <i className="fab fa-linkedin"></i>
                        </a>
                     </div>
                  </div>

                  {/* Madison Kolley */}
                  <div className="team-member">
                     <a
                        href="https://www.linkedin.com/in/madison-kolley"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <img
                           src={developer}
                           alt="Madison Kolley"
                           className="team-img"
                        />
                     </a>
                     <h3 className="team-name">Madison Kolley</h3>
                     <p className="team-role">Full-stack Developer</p>
                     <p className="team-bio">
                        Madison is an innovative problem solver with a strong focus on
                        front-end frameworks and UX design.
                     </p>
                     <div className="social-icons">
                        <a
                           href="https://www.linkedin.com/in/madison-kolley"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="icon linkedin"
                        >
                           <i className="fab fa-linkedin"></i>
                        </a>
                     </div>
                  </div>

                  {/* Shangchen Hsieh */}
                  <div className="team-member">
                     <a
                        href="https://sean-portfolio-git-main-shangchenhsiehs-projects.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <img src={sean} alt="Shangchen Hsieh" className="team-img" />
                     </a>
                     <h3 className="team-name">Shangchen Hsieh</h3>
                     <p className="team-role">Full-stack Developer</p>
                     <p className="team-bio">
                        Sean is a dedicated full-stack developer operated by coffee
                        and tea. Bring him a coffee, and he’ll solve your toughest coding
                        issues!
                     </p>
                     <div className="social-icons">
                        <a
                           href="https://sean-portfolio-git-main-shangchenhsiehs-projects.vercel.app/"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="icon portfolio"
                        >
                           <i className="fas fa-briefcase"></i>
                        </a>
                     </div>
                  </div>

                  {/* Tanisha Damle */}
                  <div className="team-member">
                     <a
                        href="https://www.linkedin.com/in/tanisha-damle"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <img
                           src={developer}
                           alt="Tanisha Damle"
                           className="team-img"
                        />
                     </a>
                     <h3 className="team-name">Tanisha Damle</h3>
                     <p className="team-role">Full-stack Developer</p>
                     <p className="team-bio">
                        Tanisha excels at creating intuitive and efficient web interfaces.
                        She loves transforming designs into interactive experiences.
                     </p>
                     <div className="social-icons">
                        <a
                           href="https://www.linkedin.com/in/tanisha-damle"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="icon linkedin"
                        >
                           <i className="fab fa-linkedin"></i>
                        </a>
                     </div>
                  </div>

                  {/* Yossef Eini */}
                  <div className="team-member">
                     <a
                        href="https://www.linkedin.com/in/yossefeini/"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <img
                           src={developer}
                           alt="Yossef Eini"
                           className="team-img"
                        />
                     </a>
                     <h3 className="team-name">Yossef Eini</h3>
                     <p className="team-role">Full-stack Developer</p>
                     <p className="team-bio">
                        Yossef is a passionate developer focused on backend systems and API
                        integrations, with a love for clean and efficient code.
                     </p>
                     <div className="social-icons">
                        <a
                           href="https://www.linkedin.com/in/yossefeini/"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="icon linkedin"
                        >
                           <i className="fab fa-linkedin"></i>
                        </a>
                     </div>
                  </div>
               </div>
            </section>

         </div>
      </div>
   );
};

export default AboutUs;
