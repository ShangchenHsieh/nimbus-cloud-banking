import "./styling/UserPaymentOption.css";

const UserPaymentOption = (props) => {
   return (
      <>
         <div className="userpaymentoption-container" onClick={props.action}>
            <h3 className="title-bright">{props.title}</h3>
            <p className="text-bright">{props.desc}</p>
         </div>
      </>
   );
};

export default UserPaymentOption;
