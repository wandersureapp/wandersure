import BrowsePlans from './pages/BrowsePlans';
import CustomizeInsurance from './pages/CustomizeInsurance';
import Dashboard from './pages/Dashboard';
import InvestorPitch from './pages/InvestorPitch';
import InvestorPitchPrint from './pages/InvestorPitchPrint';
import MyTrips from './pages/MyTrips';
import NewTrip from './pages/NewTrip';
import TripDetail from './pages/TripDetail';
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
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};