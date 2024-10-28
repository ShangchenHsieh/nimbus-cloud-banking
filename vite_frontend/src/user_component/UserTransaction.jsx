import "./styling/UserTransaction.css";

const UserTransaction = (props) => {
   // Check if the transaction should be displayed as negative based on props.type
   const isNegative =
      props.transactionType === "withdrawal" || props.transactionType === "transfer out";

   return (
      <div className="transaction-container">
         <h3 className="transaction-title">Transaction #{props.id}</h3>
         <p className="text">{props.desc}</p>
         <p className={isNegative ? "transaction-text-negative" : "transaction-text-positive"}>
            {isNegative ? "-$" : "+$"}
            {Math.abs(props.amount)}
         </p>
      </div>
   );
};

export default UserTransaction;
