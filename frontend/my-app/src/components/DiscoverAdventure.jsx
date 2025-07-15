import React from "react";
import PageLayout from "../components/PageLayout";
import DiscoverAdventure from "../components/DiscoverAdventure";
// ...other imports like Testimonials, AboutUs, etc.

const LandingPage = () => {
  return (
    <PageLayout>
      <DiscoverAdventure />

      {/* Continue with the other sections below */}
      {/* <TeamTravel /> */}
      {/* <Testimonials /> */}
      {/* <ContactUs /> */}
      {/* ... */}
    </PageLayout>
  );
};

export default LandingPage;
