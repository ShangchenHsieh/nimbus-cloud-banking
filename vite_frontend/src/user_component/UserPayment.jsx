import "./styling/UserPayment.css";

const UserPayment = (props) => {
   return (
      <>
         <div className="payment-container">
            <h3 className="title-bright">{props.title}</h3>
            <p className="text-bright">{props.desc}</p>
         </div>
      </>
   );
};

export default UserPayment;
