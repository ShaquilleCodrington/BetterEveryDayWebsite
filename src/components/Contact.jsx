// 2026-11-13: NEW FILE - Contact section, the last module on the landing page
// 2026-11-14: Github, Instagram and Linkedin are no longer exported by
// lucide-react, so the import and the three icon entries below use icons
// that still exist (Code, Camera, Briefcase).
import { Briefcase, Camera, Code, Mail, Music2, Phone } from "lucide-react";

// Direct ways to reach us. mailto: and tel: open the visitor's mail / phone app.
const DIRECT = [
  {
    label: "Email",
    detail: "shaqcodwrk@gmail.com",
    href: "mailto:shaqcodwrk@gmail.com",
    icon: Mail,
    tooltip: "Send an email",
  },
  {
    label: "Phone",
    detail: "(850) 260-2384",
    href: "tel:+18502602384",
    icon: Phone,
    tooltip: "Call (850) 260-2384",
  },
];

// Profiles. These open in a new tab, so visitors don't lose the site.
const ONLINE = [
  {
    label: "LinkedIn",
    detail: "Shaquille Codrington",
    href: "https://www.linkedin.com/in/shaquillecodrington/",
    icon: Briefcase, // 2026-11-14: was Linkedin
    tooltip: "Open LinkedIn profile",
  },
  {
    label: "GitHub",
    detail: "BetterEveryDay",
    href: "https://github.com/ShaquilleCodrington/BetterEveryDay",
    icon: Code, // 2026-11-14: was Github
    tooltip: "Open GitHub repository",
  },
  {
    label: "Instagram",
    detail: "BetterEveryDay",
    href: "https://www.instagram.com/betterreverrydayy",
    icon: Camera, // 2026-11-14: was Instagram
    tooltip: "Open Instagram",
  },
  {
    label: "TikTok",
    detail: "BetterEveryDay",
    href: "https://www.tiktok.com/@betterreverrydayy",
    icon: Music2,
    tooltip: "Open TikTok",
  },
];

// One clickable card. The whole card is the link, so the touch target is large.
function ContactCard({ item, external }) {
  const Icon = item.icon;
  // Only profile links open a new tab; mailto: and tel: should not.
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <li>
      <a className="contact-card" href={item.href} title={item.tooltip} {...linkProps}>
        <span className="contact-card__icon">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="contact-card__text">
          <span className="contact-card__label">{item.label}</span>
          <span className="contact-card__detail">{item.detail}</span>
        </span>
      </a>
    </li>
  );
}

export default function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      {/* 2026-11-14: website-h2 / website-p text classes */}
      <h2 id="contact-heading" className="website-h2">Contact</h2>

      <p className="contact-intro website-p">
        To discuss collaborating on a project or hiring, reach out by email or phone. 
      </p>
        <p className="website-p" style={{ textAlign: 'right', color: 'var(--text-on-dark-muted)'}}>
        You can also check out my LinkedIn, and follow BetterEveryDay on Instagram and TikTok.
        </p>


      <ul className="contact-grid contact-grid--direct">
        {DIRECT.map((item) => (
          <ContactCard key={item.label} item={item} />
        ))}
      </ul>

      <ul className="contact-grid contact-grid--online">
        {ONLINE.map((item) => (
          <ContactCard key={item.label} item={item} external />
        ))}
      </ul>
    </section>
  );
}