import GradientBackground from "../components/GradientBackground.jsx";
import GradientControls from "../components/GradientControls.jsx";

export default function LandingPage() {
  return (
    <>
      <GradientBackground />
      <main className="site-shell" aria-label="Better Every Day website">
        <div className="site-content">
          <section
            className="about-section"
            id="about"
            aria-labelledby="about-heading"
          >
            <h1 id="about-heading">What is Better Every Day?</h1>

            <p>
              Better Every Day is a productivity ecosystem built for students to
              organize their work, capture ideas, and make steady progress in
              their field.
            </p>

            <p>
              It was born from the frustration of juggling multiple
              subscriptions, working around missing features, and carrying your
              information from one app to another. We’re bringing the tools you
              need together and making it easier to keep your work moving.
            </p>

            <p>
              Better Every Day will keep learning and growing with you. Tell us
              what you need, and we’ll work to bring it to life.
            </p>

            <p>
              Come try it out at{" "}
              <a href="https://bettereveryday.study">BetterEveryDay.study</a>.
            </p>
          </section>
        </div>
      </main>
      <GradientControls />
    </>
  );
}