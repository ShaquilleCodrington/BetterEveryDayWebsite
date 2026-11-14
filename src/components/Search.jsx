// 2026-11-14: NEW FILE - search bar with a dropdown of results.
// Owns: the input, matching, keyboard handling and scrolling to a result.
// What is searchable comes from searchSections.js (or the `sections` prop).
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SEARCH_SECTIONS } from "./searchSections.js";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const SCROLL_GAP = 16; // extra space between the navbar and the destination

// ── Matching ────────────────────────────────────────────────────────────
// Every word typed has to match something (name, keyword or description).
// Name matches score highest, then keywords, then description.
// Replace this function later for full-text or field-based search.
function rankSections(query, sections) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return sections;

  const scored = [];
  sections.forEach((section, index) => {
    const name = section.name.toLowerCase();
    const keywords = (section.keywords || []).map((k) => k.toLowerCase());
    const description = (section.description || "").toLowerCase();
    let total = 0;

    for (const token of tokens) {
      let best = 0;
      if (name.startsWith(token)) best = 100;
      else if (name.includes(token)) best = 60;

      if (keywords.some((k) => k.split(" ").some((w) => w.startsWith(token)))) {
        best = Math.max(best, 40);
      } else if (keywords.some((k) => k.includes(token))) {
        best = Math.max(best, 25);
      }

      if (description.includes(token)) best = Math.max(best, 10);

      if (best === 0) return; // this section doesn't match every word
      total += best;
    }
    scored.push({ section, total, index });
  });

  return scored
    .sort((a, b) => b.total - a.total || a.index - b.index)
    .map((s) => s.section);
}

// ── Navigation ──────────────────────────────────────────────────────────
// .website is the scrolling container for the page, so we scroll it (not window).
function goToSection(section, container) {
  if (!container) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduceMotion ? "auto" : "smooth";

  if (section.top) {
    container.scrollTo({ top: 0, behavior });
    return;
  }

  const el = document.querySelector(section.target);
  if (!el) return;

  // Height the fixed navbar covers: its own height plus its gap from the top
  const navbar = container.querySelector(".website-navbar");
  const covered = navbar
    ? navbar.offsetHeight + (parseFloat(getComputedStyle(navbar).top) || 0)
    : 0;

  const top =
    el.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    covered -
    SCROLL_GAP;

  container.scrollTo({ top: Math.max(0, top), behavior });
}

export default function Search({ sections = SEARCH_SECTIONS, onOpenChange }) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => rankSections(query, sections), [query, sections]);
  const optionId = (i) => `${listId}-option-${i}`;

  // Tell the navbar when the panel opens or closes (it stays visible while open)
  useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  // Ctrl+K / Cmd+K focuses the search. Ignored while typing in a different field.
  useEffect(() => {
    function onKeyDown(e) {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return;
      const t = e.target;
      const typingElsewhere =
        t !== inputRef.current &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable);
      if (typingElsewhere) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
      setOpen(true);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Clicking outside closes the panel
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function select(section) {
    if (!section) return;
    const container = rootRef.current?.closest(".website");
    setOpen(false);
    setQuery("");
    setActive(0);
    inputRef.current?.blur();
    goToSection(section, container);
  }

  function onInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      if (results.length) setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (results.length) setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (open && results[active]) {
        e.preventDefault();
        select(results[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="website-search" ref={rootRef}>
      <div className="website-search-field">
        <svg
          className="website-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>

        <input
          ref={inputRef}
          className="website-search-input"
          type="text"
          role="combobox"
          aria-label="Search Better Every Day"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? optionId(active) : undefined}
          placeholder="Search Better Every Day"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
        />

        {!open && (
          <kbd className="website-search-shortcut" aria-hidden="true">
            {IS_MAC ? "⌘K" : "Ctrl K"}
          </kbd>
        )}
      </div>

      {open && (
        <div className="website-search-overlay">
          <p className="website-search-heading">
            {query.trim() ? "Results" : "Suggested"}
          </p>

          <ul className="website-search-results" id={listId} role="listbox">
            {results.map((section, i) => (
              <li
                key={section.id}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                className="website-search-result"
                onMouseMove={() => i !== active && setActive(i)}
                onClick={() => select(section)}
              >
                <span className="website-search-result-name">{section.name}</span>
                <span className="website-search-result-description">
                  {section.description}
                </span>
              </li>
            ))}
          </ul>

          {results.length === 0 && (
            <p className="website-search-empty" role="status">
              Nothing matches “{query}”. Try a section name like “about”, or a word
              like “email” or “mission”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}