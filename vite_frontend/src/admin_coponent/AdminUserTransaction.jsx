import "./styling/AdminUserTransaction.css";

const AdminUserTransaction = (props) => {
   const isNegative =
      props.transactionType === "withdrawal" || props.transactionType === "transfer out";

   // Retrieve DateTime field and parse to split into separate Date and Time fields
      const dateTime = new Date(props.transactionDate);
      const formattedDate = dateTime.toLocaleDateString();
      const formattedTime = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const providerText = props.provider ? `Provider: ${props.provider}` : "Third-party-provider";

   return (
      <div className="transaction-container">
         <h3 className="transaction-title">Transaction #{props.id}</h3>
         <p className="text">{props.desc}</p>
         {/* set showMoreInfo to True to show provider, date, and time fields */}
         {props.showMoreInfo && (
            <>
               <p className="text">{providerText}</p>
               <p className="text">Date: {formattedDate}</p>
               <p className="text">Time: {formattedTime}</p>
            </>
         )}
         <p className={isNegative ? "transaction-text-negative" : "transaction-text-positive"}>
            {isNegative ? "-$" : "+$"}
            {Math.abs(props.amount)}
         </p>
      </div>
   );
};

export default AdminUserTransaction;
