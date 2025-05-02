
import Image from "next/image";

export default function Header() {
   return (
     <div className="header">
       <div className="header__container">
        <div className="header__logo">
            <Image src={"/images/logo-placeholder.jpg"} alt="Logo" width={100} height={100} />
        </div>
        
         <div className="header__text">
           <h1 className="header__title">Välkommen till vår förening</h1>
           <p className="header__subtitle">
             Här hittar du allt om boende, kontakt och miljö.
           </p>
         </div>
       </div>
     </div>
   );
}
