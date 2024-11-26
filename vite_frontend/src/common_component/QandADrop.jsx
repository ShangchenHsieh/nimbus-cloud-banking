import { useState } from "react";
import "./styling/QandADrop.css";

const QandADrop = (props) => {
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="QandA">
            <div className="Q" onClick={() => setOpen(!open)}>
               <h3 className="Q-title">Q: {props.question}</h3>
            </div>
            <div className={open ? "A" : "A-hidden"}>
               <p className="text">A: {props.answer}</p>
            </div>
         </div>
      </>
   );
};

export default QandADrop;
