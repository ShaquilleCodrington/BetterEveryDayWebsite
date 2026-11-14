// 2026-11-13: NEW FILE - Hero section for the landing page
import { useEffect } from "react";

export default function Hero() {
  // Load the cityscape script once. It looks for #city-canvas,
  // so the canvas has to be in the DOM first, which is why this runs in an effect.
  // 2026-11-14: back to "/cityscape.js". The app only serves files from its own
  // public/ folder, so cityscape.js has to be copied there.
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
        {/* 2026-11-14: website-h1 / website-h3 / website-p text classes */}
        <h1 id="hero-heading" className="website-h1">BetterEveryDay</h1>
        
        <h3 className="website-h3" style={{ paddingLeft: '25px' }}>  - brought to you by Shaquille Codrington</h3>
        <br />
        <p className="website-p">Reduce the friction between ideas and action.</p>
      </div>
      {/* 2026-11-13: added title (hover tooltip) */}
      <a
        className="hero-button"
        href="https://bettereveryday.study/#/congruence"
        title="Open the BetterEveryDay app"
      >

       Try BetterEveryDay
      </a>
    </section>
  );
}