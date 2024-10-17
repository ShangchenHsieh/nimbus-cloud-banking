import UserNavbar from "./UserNavBar";
import UserTransaction from "./UserTransaction";
import "./styling/UserTransactions.css";

const UserTransactions = () => {
   return (
      <>
         <UserNavbar></UserNavbar>
         <div className="usertransactions-container">
            <h3 className="title">Transaction History</h3>
            <UserTransaction
               id="124"
               amount="123"
               desc={
                  <div>
                     <p className="text">Provider: SJSU</p>{" "}
                     <p className="text">Time: 10:30 PM</p>
                     <p className="text">Date: 10/10/2024</p>
                  </div>
               }
            ></UserTransaction>
            <UserTransaction
               id="123"
               amount="-123"
               desc={
                  <div>
                     <p className="text">Provider: City of San Jose</p>{" "}
                     <p className="text">Time: 8:00 PM</p>
                     <p className="text">Date: 10/10/2024</p>
                  </div>
               }
            ></UserTransaction>
         </div>
      </>
   );
};

export default UserTransactions;
