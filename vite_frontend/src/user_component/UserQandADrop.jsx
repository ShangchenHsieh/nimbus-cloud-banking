import { useState } from "react";
import "./styling/UserQandADrop.css";

const UserQandADrop = (props) => {
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="user-QandA">
            <div className="user-Q" onClick={() => setOpen(!open)}>
               <h3 className="user-Q-title">Q: {props.question}</h3>
            </div>
            <div className={open ? "user-A" : "user-A-hidden"}>
               <p className="text">A: {props.answer}</p>
            </div>
         </div>
      </>
   );
};

export default UserQandADrop;
