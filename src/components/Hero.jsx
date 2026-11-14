import { useEffect, useRef } from "react";
import "./cityscapeWebsite.js";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stop = window.startCityscape(canvas);
    return () => {
      if (stop) stop();
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-content">
        <h1 id="hero-heading" className="website-h1">BetterEveryDay</h1>
        <h3 className="website-h3" style={{ paddingLeft: "25px" }}>
          - brought to you by Shaquille Codrington
        </h3>
        <br />
        <p className="website-p">Reduce the friction between ideas and action.</p>
      </div>

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