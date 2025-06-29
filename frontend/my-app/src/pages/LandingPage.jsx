import React from "react";
import DiscoverAdventure from "../components/DiscoverAdventure";
import TeamTravel from "../components/TeamTravel";
import TravelAssistant from "../components/TravelAssistant";
import SmartTravelTools from "../components/SmartTravelTools";
import ExploreDeals from "../components/ExploreDeals";
import LastMinuteAndUniqueStays from "../components/LastMinuteAndUniqueStays";
import FavoriteStay from "../components/FavoriteStay";
import BudgetTracker from "../components/BudgetTracker";
import RealTimeAlerts from "../components/RealTimeAlerts";
import UniqueStays from "../components/UniqueStays";
import FeaturedDestination from "../components/FeaturedDestination";
import HiddenGemFinder from "../components/HiddenGemFinder";
import TravelCalendarChecklist from "../components/TravelCalendarChecklist";
import GroupBudgetCalculator from "../components/GroupBudgetCalculator";
import BuildMyDreamTrip from "../components/BuildMyDreamTrip";
import SearchResults from "../components/SearchResults";
import Testimonials from "../components/Testimonials";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import SocialCommunity from "../components/socialCommunity";
import InfoPolicies from "../components/InfoPolicies";
import WelcomeBack from "../components/WelcomeBack";

const LandingPage = () => {
  return (
    <>
      <WelcomeBack name="David" birthday="1992-05-11" />
      <DiscoverAdventure />
      <TeamTravel />
      <TravelAssistant />
      <SmartTravelTools />
      <ExploreDeals />
      <LastMinuteAndUniqueStays />
      <FavoriteStay />
      <BudgetTracker />
      <RealTimeAlerts />
      <UniqueStays />
      <FeaturedDestination />
      <HiddenGemFinder />
      <TravelCalendarChecklist />
      <GroupBudgetCalculator />
      <BuildMyDreamTrip />
      <SearchResults />
      <Testimonials />
      <AboutUs />
      <ContactUs />
      <SocialCommunity />
      <InfoPolicies />
    </>
  );
};

export default LandingPage;
