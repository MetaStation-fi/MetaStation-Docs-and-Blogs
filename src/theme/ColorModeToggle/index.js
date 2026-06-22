/**
 * Swizzled ColorModeToggle.
 *
 * Overrides the stock Docusaurus sun/moon toggle so the docs site uses the same
 * sun/moon theme toggle as the main MetaStation app (see the app's
 * `ui/enhanced-theme-toggle.jsx`): a round, bordered icon button that shows a Sun in
 * light mode and a Moon in dark mode, with a hover lift, soft glow and gentle pulse.
 *
 * The lucide Sun/Moon icons are inlined here (rather than adding lucide-react as a
 * docs dependency) so the markup stays identical to the app without extra packages.
 * The Docusaurus prop contract ({ value, onChange, className, buttonClassName }) is
 * preserved so the navbar wiring keeps working.
 */
import React from "react";
import clsx from "clsx";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

function SunIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ColorModeToggle({ className, buttonClassName, value, onChange }) {
  const isBrowser = useIsBrowser();
  // `value` is 'light' | 'dark' (config has respectPrefersColorScheme: false).
  const isLight = value === "light";
  const nextMode = value === "dark" ? "light" : "dark";

  const ariaLabel = translate(
    {
      message: "Switch between dark and light mode (currently {mode})",
      id: "theme.colorToggle.ariaLabel",
      description: "The ARIA label for the color mode toggle",
    },
    { mode: value === "dark" ? "dark mode" : "light mode" }
  );

  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx("clean-btn", styles.toggleButton, buttonClassName)}
        type="button"
        onClick={() => onChange(nextMode)}
        disabled={!isBrowser}
        title={value === "dark" ? "dark mode" : "light mode"}
        aria-label={ariaLabel}
      >
        <span className={styles.pulse} aria-hidden />
        <span className={clsx(styles.icon, isLight && styles.iconLight)}>
          {isLight ? <SunIcon /> : <MoonIcon />}
        </span>
      </button>
    </div>
  );
}

export default React.memo(ColorModeToggle);
