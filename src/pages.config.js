import Dashboard from './pages/Dashboard';
import NewTrip from './pages/NewTrip';
import TripDetail from './pages/TripDetail';
import MyTrips from './pages/MyTrips';
import BrowsePlans from './pages/BrowsePlans';
import Claims from './pages/Claims';
import CustomizeInsurance from './pages/CustomizeInsurance';
import PolicyDetail from './pages/PolicyDetail';
import InvestorPitch from './pages/InvestorPitch';
import InvestorPitchPrint from './pages/InvestorPitchPrint';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "NewTrip": NewTrip,
    "TripDetail": TripDetail,
    "MyTrips": MyTrips,
    "BrowsePlans": BrowsePlans,
    "Claims": Claims,
    "CustomizeInsurance": CustomizeInsurance,
    "PolicyDetail": PolicyDetail,
    "InvestorPitch": InvestorPitch,
    "InvestorPitchPrint": InvestorPitchPrint,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};