import "./styling/QandA.css";
import Navbar from "./Navbar";

const QandA = () => {
   return (
      <>
         <div>
            <Navbar />
            <div className="QandA-container">
               <h3 className="title">Frequent Questions and Answers</h3>
               <div className="QandA">
                  <div className="Q">
                     <h3 className="title-bright">
                        Q: How do I create a new bank account?
                     </h3>
                  </div>
                  <div className="A">
                     <p className="text">
                        A: To register your account with us, first navigate to
                        the "Sign Up" page. Next, ...
                     </p>
                  </div>
               </div>
               <div className="QandA">
                  <div className="Q">
                     <h3 className="title-bright">
                        Q: Where can I find my account balance statement?
                     </h3>
                  </div>
                  <div className="A">
                     <p className="text">
                        A: After logging in, you can navigate to your account
                        balance statement by clicking...
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default QandA;
