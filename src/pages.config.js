import BrowsePlans from './pages/BrowsePlans';
import CustomizeInsurance from './pages/CustomizeInsurance';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import InvestorPitch from './pages/InvestorPitch';
import InvestorPitchPrint from './pages/InvestorPitchPrint';
import Legal from './pages/Legal';
import MyQuotes from './pages/MyQuotes';
import MyTrips from './pages/MyTrips';
import NewTrip from './pages/NewTrip';
import NotificationSettings from './pages/NotificationSettings';
import PartnerWithUs from './pages/PartnerWithUs';
import TravelAides from './pages/TravelAides';
import TripChecklist from './pages/TripChecklist';
import TripDetail from './pages/TripDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BrowsePlans": BrowsePlans,
    "CustomizeInsurance": CustomizeInsurance,
    "Dashboard": Dashboard,
    "Home": Home,
    "InvestorPitch": InvestorPitch,
    "InvestorPitchPrint": InvestorPitchPrint,
    "Legal": Legal,
    "MyQuotes": MyQuotes,
    "MyTrips": MyTrips,
    "NewTrip": NewTrip,
    "NotificationSettings": NotificationSettings,
    "PartnerWithUs": PartnerWithUs,
    "TravelAides": TravelAides,
    "TripChecklist": TripChecklist,
    "TripDetail": TripDetail,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};