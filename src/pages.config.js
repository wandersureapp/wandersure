import BrowsePlans from './pages/BrowsePlans';
import CustomizeInsurance from './pages/CustomizeInsurance';
import Dashboard from './pages/Dashboard';
import InvestorPitch from './pages/InvestorPitch';
import InvestorPitchPrint from './pages/InvestorPitchPrint';
import MyTrips from './pages/MyTrips';
import NewTrip from './pages/NewTrip';
import TripDetail from './pages/TripDetail';
import NotificationSettings from './pages/NotificationSettings';
import MyQuotes from './pages/MyQuotes';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BrowsePlans": BrowsePlans,
    "CustomizeInsurance": CustomizeInsurance,
    "Dashboard": Dashboard,
    "InvestorPitch": InvestorPitch,
    "InvestorPitchPrint": InvestorPitchPrint,
    "MyTrips": MyTrips,
    "NewTrip": NewTrip,
    "TripDetail": TripDetail,
    "NotificationSettings": NotificationSettings,
    "MyQuotes": MyQuotes,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};