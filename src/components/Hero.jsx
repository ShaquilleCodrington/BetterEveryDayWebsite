// 2026-11-13: NEW FILE - Hero section for the landing page
import { useEffect } from "react";

export default function Hero() {
  // Load the cityscape script once. It looks for #city-canvas,
  // so the canvas has to be in the DOM first, which is why this runs in an effect.
  useEffect(() => {
    if (document.getElementById("cityscape-script")) return;
    const script = document.createElement("script");
    script.id = "cityscape-script";
    script.src = "/cityscape.js";
    document.body.appendChild(script);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <canvas id="city-canvas" className="hero-canvas" aria-hidden="true" />

      <div className="hero-content">
        <h1 id="hero-heading">BetterEveryDay</h1>
        
        <h3 style={{ paddingLeft: '25px' }}>  - brought to you by Shaquille Codrington</h3>
        <br />
        <p>Reduce the friction between ideas and action.</p>
      </div>
      {/* 2026-11-13: added title (hover tooltip) */}
      <a
        className="hero-button"
        href="https://bettereveryday.study"
        title="Open the BetterEveryDay app"
      >

       Try BetterEveryDay
      </a>
    </section>
  );
}