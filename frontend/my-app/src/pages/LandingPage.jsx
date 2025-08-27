import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

// 🔹 Section Components
import WelcomeBack from "../components/WelcomeBack";
import DiscoverAdventure from "../components/DiscoverAdventure";
import TeamTravelSection from "../components/TeamTravelSection";
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
import SearchResults from "../components/SearchResults";
import Testimonials from "../components/Testimonials";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import SocialCommunity from "../components/SocialCommunity";
import InfoPolicies from "../components/InfoPolicies";
import TutorialModal from "../components/TutorialModal";
import FeedbackForm from "../components/FeedbackForm";

// 🔹 Layout Wrapper
import PageLayout from "../components/PageLayout";

// 🔹 Animation Wrapper
import FadeInSection from "../components/animations/FadeInSection";

// Helper for in-page scrolling
const goToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const LandingPage = () => {
  return (
    <PageLayout>
      {/* 🔹 Welcome Message */}
      <WelcomeBack name="David" birthday="1992-05-11" />
      <TutorialModal />

      {/* 🔹 Discover Adventure */}
      <FadeInSection>
        <section id="discover" className="section-anchor">
          <DiscoverAdventure />
        </section>
      </FadeInSection>

      {/* 🔹 Travel Tools & Planning */}
      <FadeInSection>
        <section id="team-travel" className="section-anchor">
          <TeamTravelSection />
        </section>
      </FadeInSection>

      <FadeInSection>
        <section id="ai-builder" className="section-anchor">
          <TravelAssistant />
        </section>
      </FadeInSection>

      <FadeInSection>
        <section id="explore-deals" className="section-anchor">
          <ExploreDeals />
        </section>
      </FadeInSection>

      <FadeInSection>
        <section id="unique-stays" className="section-anchor">
          <UniqueStays />
        </section>
      </FadeInSection>

      <FadeInSection>
        <section id="last-minute" className="section-anchor">
          <LastMinuteAndUniqueStays />
        </section>
      </FadeInSection>

      {/* 🔹 Featured Section */}
      <FadeInSection>
        <FeaturedDestination />
      </FadeInSection>

      {/* 🔹 Community Features */}
      <FadeInSection>
        <SocialCommunity />
      </FadeInSection>

      {/* 🔹 Testimonials */}
      <FadeInSection>
        <Testimonials />
      </FadeInSection>

      {/* 🔹 XP Rewards Banner */}
      <FadeInSection>
        <section
          className="section alt osq-hero text-center"
          style={{ padding: "3rem 0" }}
        >
          <h2 className="text-2xl font-semibold mb-2">
            💥 Earn XP Every Time You Travel
          </h2>
          <p className="text-muted">
            Unlock exclusive badges, perks, and trip rewards. Your journey just
            got gamified.
          </p>
        </section>
      </FadeInSection>

      {/* 🔹 Final CTA */}
      <FadeInSection>
        <section
          className="section text-center"
          style={{ padding: "2.5rem 0" }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Quest?</h2>
          <Link to="/profile">
            <Button type="primary" size="large" className="shadow-soft">
              🚀 Create Your Profile
            </Button>
          </Link>
        </section>
      </FadeInSection>

      {/* 🔹 Feedback Form */}
      <FeedbackForm />

      {/* 🔹 Footer */}
      <footer className="footer text-center" style={{ padding: "1.5rem 0" }}>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} One Sky Quest. All rights reserved.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={() => goToSection("about")}
            className="hover:underline"
          >
            About
          </button>
          <button
            onClick={() => goToSection("contact")}
            className="hover:underline"
          >
            Contact
          </button>
          <button
            onClick={() => goToSection("questfeed")}
            className="hover:underline"
          >
            Quest Feed
          </button>
        </div>
      </footer>

      {/* 🔹 Info & Legal */}
      <section id="about">
        <AboutUs />
      </section>
      <section id="contact">
        <ContactUs />
      </section>
      <section id="policies">
        <InfoPolicies />
      </section>
    </PageLayout>
  );
};

export default LandingPage;
