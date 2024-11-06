import "./styling/AdminUserCard.css";

const AdminUserCard = (props) => {
   return (
      <>
         <div className="adminusercard-container">
            <h3 className="adminusercard-title-bright">
               {props.firstName} {props.lastName}
            </h3>
            <p className="adminusercard-text-bright">
               Phone: {props.phone}
               <br></br>
               Email: {props.email}
            </p>
         </div>
      </>
   );
};

export default AdminUserCard;
