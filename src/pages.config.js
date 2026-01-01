import BrowsePlans from './pages/BrowsePlans';
import CustomizeInsurance from './pages/CustomizeInsurance';
import Dashboard from './pages/Dashboard';
import InvestorPitch from './pages/InvestorPitch';
import InvestorPitchPrint from './pages/InvestorPitchPrint';
import Legal from './pages/Legal';
import MyQuotes from './pages/MyQuotes';
import MyTrips from './pages/MyTrips';
import NewTrip from './pages/NewTrip';
import NotificationSettings from './pages/NotificationSettings';
import PartnerWithUs from './pages/PartnerWithUs';
import TripDetail from './pages/TripDetail';
import TravelAides from './pages/TravelAides';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BrowsePlans": BrowsePlans,
    "CustomizeInsurance": CustomizeInsurance,
    "Dashboard": Dashboard,
    "InvestorPitch": InvestorPitch,
    "InvestorPitchPrint": InvestorPitchPrint,
    "Legal": Legal,
    "MyQuotes": MyQuotes,
    "MyTrips": MyTrips,
    "NewTrip": NewTrip,
    "NotificationSettings": NotificationSettings,
    "PartnerWithUs": PartnerWithUs,
    "TripDetail": TripDetail,
    "TravelAides": TravelAides,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};