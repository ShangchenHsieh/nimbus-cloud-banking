import "./styling/UserTransaction.css";

const UserTransaction = (props) => {
   return (
      <>
         <div className="transaction-container">
            <h3 className="transaction-title">Transaction #{props.id}</h3>
            <p
               className={
                  props.amount > 0
                     ? "transaction-text-positive"
                     : "transaction-text-negative"
               }
            >
               {props.amount > 0 ? "$" : "-$"}
               {Math.abs(props.amount)}
            </p>
         </div>
      </>
   );
};

export default UserTransaction;
