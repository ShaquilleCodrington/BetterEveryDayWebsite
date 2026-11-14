// 2026-11-14: NEW FILE - searchable sections for the website search.
// To make something searchable, add an entry here. Search.jsx doesn't change.
//   id          unique key
//   name        shown as the result title
//   description shown under the title
//   keywords    synonyms that should also match
//   target      CSS selector to scroll to (a list is fine: first match wins)
//   top         true = scroll to the top of the page instead of a target

export const SEARCH_SECTIONS = [
  {
    id: "home",
    name: "Home",
    description: "Back to the top of the page.",
    keywords: ["welcome", "beginning", "top", "start"],
    top: true,
  },
  {
    id: "hero",
    name: "Hero",
    description: "An introduction to BetterEveryDay.",
    keywords: ["introduction", "intro", "BetterEveryDay", "product"],
    target: "#hero-heading",
  },
  {
    id: "about",
    name: "About",
    description: "What Better Every Day is and why it exists.",
    keywords: ["company", "mission", "who we are"],
    target: "#about",
  },
  {
    id: "contact",
    name: "Contact",
    description: "Email, phone and profile links.",
    keywords: ["email", "support", "feedback", "message"],
    // I haven't seen Contact.jsx. This matches #contact if it has that id,
    // otherwise the section by its class.
    target: "#contact, .contact-section",
  },
];