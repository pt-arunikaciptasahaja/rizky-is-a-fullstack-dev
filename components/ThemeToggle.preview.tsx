/* Hallmark · ThemeToggle preview · eight production states */
import { ThemeToggle, type ThemeToggleState } from "./ThemeToggle";

const states: ThemeToggleState[] = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "error",
  "success",
];

export function ThemeTogglePreview() {
  return (
    <div className="theme-toggle-preview">
      {states.map((state) => (
        <figure key={state}>
          <ThemeToggle previewState={state} />
          <figcaption>{state}</figcaption>
        </figure>
      ))}
    </div>
  );
}
