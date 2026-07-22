/* Hallmark · AnimatedWelcome preview · eight production states */
import {
  AnimatedWelcome,
  type AnimatedWelcomeState,
} from "./AnimatedWelcome";

const states: AnimatedWelcomeState[] = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "error",
  "success",
];

export function AnimatedWelcomePreview() {
  return (
    <div className="animated-welcome-preview">
      {states.map((state) => (
        <figure key={state}>
          <AnimatedWelcome previewState={state} />
          <figcaption>{state}</figcaption>
        </figure>
      ))}
    </div>
  );
}
