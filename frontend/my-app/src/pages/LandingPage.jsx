import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

// 🔹 Section Components
import WelcomeBack from "../components/WelcomeBack";
import DiscoverAdventure from "../components/DiscoverAdventure";
import TeamTravel from "../components/TeamTravel";
import TravelAssistant from "../components/TravelAssistant";
import SmartTravelTools from "../components/SmartTravelTools";
import ExploreDeals from "../components/ExploreDeals";
import Excursions from "../components/excursions/Excursions";
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
import SocialCommunity from "../components/SocialCommunity";
import InfoPolicies from "../components/InfoPolicies";
import TutorialModal from "../components/TutorialModal";
import FeedbackForm from "../components/FeedbackForm"; // ✅ Added

// 🔹 Layout Wrapper
import PageLayout from "../components/PageLayout";

const LandingPage = () => {
  return (
    <PageLayout>
      {/* 🔹 Welcome Banner */}
      <WelcomeBack name="David" birthday="1992-05-11" />
      <TutorialModal />
      <DiscoverAdventure />

      {/* 🔹 Core Sections */}
      <TeamTravel />
      <TravelAssistant />
      <SmartTravelTools />
      <ExploreDeals />
      <Excursions />
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
      <SocialCommunity />

      {/* 🔹 XP Banner */}
      <section className="py-12 text-center bg-gradient-to-r from-purple-200 via-pink-100 to-orange-100">
        <h2 className="text-2xl font-semibold mb-2">
          💥 Earn XP Every Time You Travel
        </h2>
        <p>
          Unlock exclusive badges, perks, and trip rewards. Your journey just
          got gamified.
        </p>
      </section>

      {/* 🔹 Final CTA */}
      <section className="text-center py-10 bg-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Quest?</h2>
        <Link to="/profile">
          <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
            🚀 Create Your Profile
          </Button>
        </Link>
      </section>

      {/* 🔹 Feedback Form */}
      <FeedbackForm />

      {/* 🔹 Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} One Sky Quest. All rights reserved.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/questfeed" className="hover:underline">
            Quest Feed
          </Link>
        </div>
      </footer>

      {/* 🔹 Info & Legal */}
      <AboutUs />
      <ContactUs />
      <InfoPolicies />
    </PageLayout>
  );
};

export default LandingPage;
