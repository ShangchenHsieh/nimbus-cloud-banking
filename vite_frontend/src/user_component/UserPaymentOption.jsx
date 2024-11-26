import "./styling/UserPaymentOption.css";

const UserPaymentOption = (props) => {
   return (
      <>
         <div className="userpaymentoption-container" onClick={props.action}>
            <h3 className="title-bright">{props.title}</h3>
            <div className="option-icon-container">
               <img className="option-icon" src={props.icon}></img>
            </div>
         </div>
      </>
   );
};

export default UserPaymentOption;
