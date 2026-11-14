import GradientBackground from "../components/GradientBackground.jsx";
import GradientControls from "../components/GradientControls.jsx";
// 2026-11-13: import the new Hero component
import Hero from "../components/Hero.jsx";
import Contact from "../components/Contact.jsx";

export default function LandingPage() {
  return (
    // 2026-11-14: .website wrapper. All website styles are scoped to it, and it
    // is the scrolling container for the page.
    <div className="website">
      <GradientBackground />
      <main className="site-shell" aria-label="Better Every Day website">
        <div className="site-content">
            {/* 2026-11-13: Hero is the first module on the page */}
          <Hero />

          <section
            className="about-section"
            id="about"
            aria-labelledby="about-heading"
          >
            {/* 2026-11-14: website-h1 / website-p / website-a text classes */}
            <h1 id="about-heading" className="website-h1">What is Better Every Day?</h1>

            <p className="website-p">
              Better Every Day is a productivity ecosystem built for students to
              organize their work, capture ideas, and make steady progress in
              their field.
            </p>

            <p className="website-p">
              It was born from the frustration of juggling multiple
              subscriptions, working around missing features, and carrying your
              information from one app to another. We’re bringing the tools you
              need together and making it easier to keep your work moving.
            </p>

            <p className="website-p">
              Better Every Day will keep learning and growing with you. Tell us
              what you need, and we’ll work to bring it to life.
            </p>

            <p className="website-p">
              Come try it out at{" "}
              {/* 2026-11-13: added title (hover tooltip) */}
              <a
                className="website-a"
                href="https://bettereveryday.study"
                title="Open the BetterEveryDay app"
              >
                BetterEveryDay.study
              </a>
              .
            </p>
          </section>
           {/* 2026-11-13: Contact is the last module on the page */}
          <Contact />
        </div>
      </main>
      <GradientControls />
    </div>
  );
}