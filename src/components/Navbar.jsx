// 2026-11-14: NEW FILE - website navbar: logo on the left, search in the middle.
// Fixed at the top. Hides when scrolling down, returns when scrolling up, and
// stays visible while the search panel is open.
import { useEffect, useRef, useState } from "react";
import Search from "./Search.jsx";

// Where the logo goes. (Your Hero button links use bettereveryday.study; change
// this one line if the home page should be that domain instead.)
const HOME_URL = "https://bettereveryday.study";

export default function Navbar() {
  const navRef = useRef(null);
  const searchOpenRef = useRef(false);
  const [hidden, setHidden] = useState(false);

  function handleSearchOpenChange(open) {
    searchOpenRef.current = open;
    if (open) setHidden(false);
  }

  useEffect(() => {
    // .website is the scrolling container, so listen there rather than on window
    const container = navRef.current?.closest(".website");
    if (!container) return;

    let lastY = container.scrollTop;

    function onScroll() {
      const y = container.scrollTop;
      const delta = y - lastY;

      if (y <= 10 || searchOpenRef.current) {
        setHidden(false);
        lastY = y;
        return;
      }
      if (Math.abs(delta) < 6) return; // ignore tiny movements
      setHidden(delta > 0);
      lastY = y;
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={`website-navbar${hidden ? " website-navbar-hidden" : ""}`}
    >
      <a
        className="website-navbar-logo"
        href={HOME_URL}
        title="Go to the Better Every Day home page"
      >
        BetterEveryDay
      </a>

      <Search onOpenChange={handleSearchOpenChange} />
    </header>
  );
}