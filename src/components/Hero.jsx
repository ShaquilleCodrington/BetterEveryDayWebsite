// 2026-11-13: NEW FILE - Hero section for the landing page
// 2026-11-14: still loads /cityscapeWebsite.js from public/, but the script now only
// defines window.startCityscape. Hero starts it on its own canvas and stops it on
// unmount. The script tag is added once and left in place, so StrictMode's
// mount/unmount/mount in dev can't inject it twice or lose it.
import { useEffect, useRef } from "react";

const SCRIPT_ID = "cityscapeWebsite-script";
const SCRIPT_SRC = `${import.meta.env.BASE_URL}cityscapeWebsite.js`;

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stop = null;
    let cancelled = false;

    const start = () => {
      if (cancelled || stop) return;
      stop = window.startCityscape(canvas);
    };

    let script = document.getElementById(SCRIPT_ID);

    if (window.startCityscape) {
      // Script already loaded (e.g. second StrictMode run, or navigating back)
      start();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", start);
    }

    return () => {
      cancelled = true;
      if (script) script.removeEventListener("load", start);
      if (stop) stop();
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

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