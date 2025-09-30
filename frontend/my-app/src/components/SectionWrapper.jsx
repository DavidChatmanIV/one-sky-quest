import React from "react";
import PropTypes from "prop-types";

const SectionWrapper = ({
  children,
  bg = "white",
  id = "",
  showCurve = false,
  animation = "fade-up",
}) => {
  return (
    <section
      id={id}
      className={`relative py-20 px-6 bg-${bg} w-full`}
      data-aos={animation}
    >
      <div className="max-w-7xl mx-auto">{children}</div>

      {showCurve && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            viewBox="0 0 1440 100"
            className="block w-full"
            preserveAspectRatio="none"
          >
            <path fill="#fff" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
          </svg>
        </div>
      )}
    </section>
  );
};

SectionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  bg: PropTypes.string,
  id: PropTypes.string,
  showCurve: PropTypes.bool,
  animation: PropTypes.string,
};

export default SectionWrapper;
