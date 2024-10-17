import "./styling/AdminTransaction.css";

const AdminTransaction = (props) => {
   return (
      <>
         <div className="transaction-container">
            <h3 className="transaction-title">Transaction #{props.id}</h3>
            <p className="text">{props.desc}</p>
            <p
               className={
                  props.amount > 0
                     ? "transaction-text-positive"
                     : "transaction-text-negative"
               }
            >
               {props.amount > 0 ? "+$" : "-$"}
               {Math.abs(props.amount)}
            </p>
         </div>
      </>
   );
};

export default AdminTransaction;
