import AdminDashboard from './pages/AdminDashboard';
import AlertMetricsAdmin from './pages/AlertMetricsAdmin';
import Alerts from './pages/Alerts';
import BrowsePlans from './pages/BrowsePlans';
import BudgetPlanner from './pages/BudgetPlanner';
import CustomizeInsurance from './pages/CustomizeInsurance';
import Dashboard from './pages/Dashboard';
import DestinationPlaybook from './pages/DestinationPlaybook';
import GmailCallback from './pages/GmailCallback';
import GroupTravelCoordinator from './pages/GroupTravelCoordinator';
import Home from './pages/Home';
import HowAlertsWork from './pages/HowAlertsWork';
import InvestorPitch from './pages/InvestorPitch';
import InvestorPitchPrint from './pages/InvestorPitchPrint';
import Legal from './pages/Legal';
import MyQuotes from './pages/MyQuotes';
import MyTrips from './pages/MyTrips';
import NewTrip from './pages/NewTrip';
import NotificationSettings from './pages/NotificationSettings';
import PartnerWithUs from './pages/PartnerWithUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import SafetyGuide from './pages/SafetyGuide';
import TermsOfService from './pages/TermsOfService';
import TravelAides from './pages/TravelAides';
import TripChecklist from './pages/TripChecklist';
import TripDetail from './pages/TripDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "AlertMetricsAdmin": AlertMetricsAdmin,
    "Alerts": Alerts,
    "BrowsePlans": BrowsePlans,
    "BudgetPlanner": BudgetPlanner,
    "CustomizeInsurance": CustomizeInsurance,
    "Dashboard": Dashboard,
    "DestinationPlaybook": DestinationPlaybook,
    "GmailCallback": GmailCallback,
    "GroupTravelCoordinator": GroupTravelCoordinator,
    "Home": Home,
    "HowAlertsWork": HowAlertsWork,
    "InvestorPitch": InvestorPitch,
    "InvestorPitchPrint": InvestorPitchPrint,
    "Legal": Legal,
    "MyQuotes": MyQuotes,
    "MyTrips": MyTrips,
    "NewTrip": NewTrip,
    "NotificationSettings": NotificationSettings,
    "PartnerWithUs": PartnerWithUs,
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "SafetyGuide": SafetyGuide,
    "TermsOfService": TermsOfService,
    "TravelAides": TravelAides,
    "TripChecklist": TripChecklist,
    "TripDetail": TripDetail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};