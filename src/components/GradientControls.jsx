// 2026-11-13: the trigger is a paintbrush icon button (see the <summary> at the bottom).
import { useEffect, useRef, useState } from "react";
// 2026-11-13: Lucide paintbrush icon
import { Paintbrush } from "lucide-react";

// Each entry maps to one CSS custom property from index.css.
// All of them are printed; only some have controls on screen.
const PROPERTIES = [
  { key: "angle", prop: "--gradient-angle", unit: "deg" },
  { key: "startH", prop: "--gradient-start-h", unit: "" },
  { key: "startS", prop: "--gradient-start-s", unit: "%" },
  { key: "startL", prop: "--gradient-start-l", unit: "%" },
  { key: "endH", prop: "--gradient-end-h", unit: "" },
  { key: "endS", prop: "--gradient-end-s", unit: "%" },
  { key: "endL", prop: "--gradient-end-l", unit: "%" },
  { key: "startStop", prop: "--gradient-start-stop", unit: "%" },
  { key: "endStop", prop: "--gradient-end-stop", unit: "%" },
];

// Start from whatever index.css currently defines, so the CSS stays the single source of truth.
function readInitialValues() {
  const styles = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    PROPERTIES.map((p) => [p.key, parseFloat(styles.getPropertyValue(p.prop))])
  );
}

// Prints every gradient value as copy-ready CSS.
function formatValues(values) {
  return PROPERTIES.map((p) => `${p.prop}: ${values[p.key]}${p.unit};`).join("\n");
}

// ── Colour wheel (hue ring) ───────────────────────────────────────────────
function HueRing({ hue, onChange, size = 130 }) {
  const cx = size / 2;
  const outerR = size / 2;
  const innerR = outerR * 0.62;
  const handleR = (outerR + innerR) / 2;
  const toRad = (d) => (d - 90) * (Math.PI / 180);

  function handleInteraction(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : e;
    const dx = point.clientX - (rect.left + cx);
    const dy = point.clientY - (rect.top + cx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < innerR * 0.8 || dist > outerR + 10) return;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    onChange(Math.round(angle) % 360);
  }

  const segments = 60;
  const paths = Array.from({ length: segments }, (_, i) => {
    const a1 = (i / segments) * 360;
    const a2 = ((i + 1) / segments) * 360;
    const x1o = cx + outerR * Math.cos(toRad(a1));
    const y1o = cx + outerR * Math.sin(toRad(a1));
    const x2o = cx + outerR * Math.cos(toRad(a2));
    const y2o = cx + outerR * Math.sin(toRad(a2));
    const x1i = cx + innerR * Math.cos(toRad(a1));
    const y1i = cx + innerR * Math.sin(toRad(a1));
    const x2i = cx + innerR * Math.cos(toRad(a2));
    const y2i = cx + innerR * Math.sin(toRad(a2));
    return (
      <path
        key={i}
        d={`M${x1o},${y1o} A${outerR},${outerR} 0 0,1 ${x2o},${y2o} L${x2i},${y2i} A${innerR},${innerR} 0 0,0 ${x1i},${y1i} Z`}
        fill={`hsl(${(a1 + a2) / 2},90%,55%)`}
      />
    );
  });

  const hx = cx + handleR * Math.cos(toRad(hue));
  const hy = cx + handleR * Math.sin(toRad(hue));

  return (
    <svg
      className="hue-ring"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onMouseDown={handleInteraction}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleInteraction(e);
      }}
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {paths}
      <circle
        className="hue-ring__handle"
        cx={hx}
        cy={hy}
        r="7"
        fill={`hsl(${hue},90%,60%)`}
        stroke="#fff"
        strokeWidth="2"
      />
    </svg>
  );
}

// ── One colour stop: hue ring + lightness slider + swatch ────────────────
function GradientStopRow({ label, hue, saturation, lightness, onHue, onLightness }) {
  const id = `gradient-lightness-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="gradient-stop">
      <p className="gradient-controls__label">{label}</p>
      <div className="gradient-stop__body">
        <HueRing hue={hue} onChange={onHue} />
        <div className="gradient-stop__fields">
          <div className="gradient-controls__row">
            <label className="gradient-controls__label" htmlFor={id}>
              Lightness
            </label>
            <output className="gradient-controls__value" htmlFor={id}>
              {Math.round(lightness)}%
            </output>
          </div>
          <input
            id={id}
            type="range"
            min="0"
            max="100"
            step="1"
            value={lightness}
            onChange={(e) => onLightness(parseFloat(e.target.value))}
            style={{ accentColor: `hsl(${hue}, ${saturation}%, 55%)` }}
          />
          <div
            className="gradient-stop__swatch"
            style={{ background: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function GradientControls() {
  const [values, setValues] = useState(readInitialValues);
  // 2026-11-13 (round 3): a handle to the <details> element, so we can close it from code
  const detailsRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    PROPERTIES.forEach((p) => {
      root.style.setProperty(p.prop, `${values[p.key]}${p.unit}`);
    });
    console.log(`Gradient values:\n${formatValues(values)}`);
  }, [values]);

  // 2026-11-13 (round 3): close the pop-out on a press anywhere outside it, or on Escape.
  // Presses inside the panel are ignored here, so sliders and the colour wheel work normally.
  // pointerdown covers mouse, touch and pen with one listener.
  useEffect(() => {
    function closeIfOutside(e) {
      const el = detailsRef.current;
      if (el && el.open && !el.contains(e.target)) el.open = false;
    }
    function closeOnEscape(e) {
      const el = detailsRef.current;
      if (e.key === "Escape" && el && el.open) el.open = false;
    }
    document.addEventListener("pointerdown", closeIfOutside);
    document.addEventListener("keydown", closeOnEscape);
    // Cleanup: remove the listeners if this component ever unmounts
    return () => {
      document.removeEventListener("pointerdown", closeIfOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function update(key, next) {
    setValues((prev) => ({ ...prev, [key]: next }));
  }

  return (
    // 2026-11-13 (round 3): ref added
    <details className="gradient-controls" ref={detailsRef}>
      {/* 2026-11-13: the trigger is just a paintbrush. title = hover tooltip,
          aria-label = what screen readers announce. */}
      <summary aria-label="Background settings" title="Background settings">
        <Paintbrush size={20} aria-hidden="true" />
      </summary>

      {/* 2026-11-13: wrapper so the panel pops up above the button */}
      <div className="gradient-controls__panel">
        <GradientStopRow
          label="Colour 1"
          hue={values.startH}
          saturation={values.startS}
          lightness={values.startL}
          onHue={(h) => update("startH", h)}
          onLightness={(l) => update("startL", l)}
        />
        <GradientStopRow
          label="Colour 2"
          hue={values.endH}
          saturation={values.endS}
          lightness={values.endL}
          onHue={(h) => update("endH", h)}
          onLightness={(l) => update("endL", l)}
        />

        <div className="gradient-controls__row">
          <label className="gradient-controls__label" htmlFor="gradient-angle">
            Angle
          </label>
          <output className="gradient-controls__value" htmlFor="gradient-angle">
            {Math.round(values.angle)}°
          </output>
        </div>
        <input
          id="gradient-angle"
          type="range"
          min="0"
          max="360"
          step="1"
          value={values.angle}
          onChange={(e) => update("angle", parseFloat(e.target.value))}
        />

        <pre className="gradient-controls__output">{formatValues(values)}</pre>
      </div>
    </details>
  );
}