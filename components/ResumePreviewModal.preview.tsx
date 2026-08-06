/* Hallmark · ResumePreview trigger preview · eight production states */
import {
  ResumePreviewTrigger,
  type ResumePreviewTriggerState,
} from "./ResumePreviewModal";

const states: ResumePreviewTriggerState[] = [
  "default",
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "error",
  "success",
];

export function ResumePreviewModalPreview() {
  return (
    <div className="resume-trigger-preview">
      {states.map((state) => (
        <figure key={state}>
          <ResumePreviewTrigger className="button button-secondary" previewState={state}>
            View Résumé
          </ResumePreviewTrigger>
          <figcaption>{state}</figcaption>
        </figure>
      ))}
    </div>
  );
}
