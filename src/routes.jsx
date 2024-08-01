import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineCampaign } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { CiMedicalClipboard } from "react-icons/ci";
import { RiMentalHealthLine } from "react-icons/ri";
import { PiUsers } from "react-icons/pi";
import { GiArtificialIntelligence } from "react-icons/gi";
import Home from './pages/Home/Home';
import { Login } from "./components/Login/Login";
import Campaigns from "./pages/Campaigns/Campaigns";
import Users from "./pages/Users/Users";
import Patients from "./pages/Patients/Patients";
import MedicalDocuments from "./pages/MedicalDocuments/MedicalDocuments";
import TestIA from "./pages/TestIA/TestIA";
import ContactPoints from "./pages/ContactsPoints/contactPoints";


const routes = [
    { name: "Puntos de contacto", path: '/contacts-points', component: ContactPoints, icon: ({...props}) =><RiContactsLine size="1.2em" {...props}/> },
    { name: "Campañas de marketing", path: '/campaigns', component: Campaigns, icon: ({...props}) =><MdOutlineCampaign size="1.2em" {...props}/> },
    { name: "Dashboard", path: '/', component: Home, icon: ({...props}) => <IoHomeOutline size="1.2em" {...props}/> },
    { name: "Inicio de sesión", path: '/Login', component: Login, icon: ({...props}) =><MdOutlineCampaign size="1.2em" {...props}/> },    
];

export default routes;