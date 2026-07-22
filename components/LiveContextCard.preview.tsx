/* Hallmark · LiveContextCard preview · eight production states */
import { LiveContextCard, type LiveContextState } from "./LiveContextCard";

const states: LiveContextState[] = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "error",
  "success",
];

export function LiveContextCardPreview() {
  return (
    <div className="live-context-preview">
      {states.map((state) => (
        <figure key={state}>
          <figcaption>{state}</figcaption>
          <LiveContextCard previewState={state} />
        </figure>
      ))}
    </div>
  );
}
