"use client";

/* Hallmark · ResumePreview · states: default/hover/focus/active/disabled/loading/error/success */
import {
  CircleAlert,
  CircleCheck,
  Download,
  ExternalLink,
  FileText,
  LoaderCircle,
  X,
} from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { siteMeta } from "@/data/portfolioData";

const RESUME_PREVIEW_EVENT = "portfolio:open-resume-preview";
const RESUME_DIALOG_ID = "resume-preview-dialog";

export type ResumePreviewTriggerState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error"
  | "success";

interface ResumePreviewTriggerProps {
  children: ReactNode;
  className: string;
  onOpen?: () => void;
  previewState?: ResumePreviewTriggerState;
}

export function ResumePreviewTrigger({
  children,
  className,
  onOpen,
  previewState = "default",
}: ResumePreviewTriggerProps) {
  const isPreview = previewState !== "default";
  const isDisabled = previewState === "disabled" || previewState === "loading";

  const icon = (() => {
    if (previewState === "loading") {
      return <LoaderCircle className="resume-trigger-spinner" aria-hidden="true" />;
    }

    if (previewState === "error") {
      return <CircleAlert aria-hidden="true" />;
    }

    if (previewState === "success") {
      return <CircleCheck aria-hidden="true" />;
    }

    return <FileText aria-hidden="true" />;
  })();

  const handleOpen = () => {
    onOpen?.();

    if (isPreview) {
      return;
    }

    const shouldOpenDirectly = window.matchMedia(
      "(max-width: 48rem), (hover: none), (pointer: coarse)",
    ).matches;

    if (shouldOpenDirectly) {
      window.open(siteMeta.resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }

    window.dispatchEvent(new Event(RESUME_PREVIEW_EVENT));
  };

  return (
    <button
      className={`${className} resume-preview-trigger`}
      type="button"
      data-state={previewState}
      aria-haspopup="dialog"
      aria-controls={RESUME_DIALOG_ID}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={handleOpen}
    >
      {children}
      {icon}
    </button>
  );
}

type PreviewStatus = "loading" | "ready" | "error";

export function ResumePreviewModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const primaryActionRef = useRef<HTMLAnchorElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>("loading");

  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;

    if (dialog?.open) {
      dialog.close();
    }

    document.body.classList.remove("resume-modal-open");
    setIsOpen(false);
    setPreviewStatus("loading");

    const fallback = document.querySelector<HTMLElement>(".menu-button");
    const focusTarget = openerRef.current?.isConnected ? openerRef.current : fallback;
    focusTarget?.focus();
  }, []);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;

    if (!dialog?.open || dialog.dataset.closing === "true") {
      return;
    }

    dialog.dataset.closing = "true";
    closeTimerRef.current = setTimeout(finishClose, 180);
  }, [finishClose]);

  useEffect(() => {
    const openDialog = () => {
      openerRef.current = document.activeElement as HTMLElement | null;
      setPreviewStatus("loading");
      setIsOpen(true);
    };

    window.addEventListener(RESUME_PREVIEW_EVENT, openDialog);
    return () => window.removeEventListener(RESUME_PREVIEW_EVENT, openDialog);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    delete dialog.dataset.closing;
    dialog.showModal();
    document.body.classList.add("resume-modal-open");
    window.requestAnimationFrame(() => primaryActionRef.current?.focus());
  }, [isOpen]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      document.body.classList.remove("resume-modal-open");
    },
    [],
  );

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      requestClose();
    }
  };

  return (
    <dialog
      className="resume-dialog"
      id={RESUME_DIALOG_ID}
      ref={dialogRef}
      aria-labelledby="resume-dialog-title"
      aria-describedby="resume-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className="resume-dialog-shell">
        <header className="resume-dialog-header">
          <div className="resume-dialog-heading">
            <span className="eyebrow">Résumé</span>
            <h2 id="resume-dialog-title">Full-stack engineering résumé</h2>
            <p id="resume-dialog-description">
              Preview the two-page PDF, download a copy, or open it in a dedicated tab.
            </p>
          </div>

          <div className="resume-dialog-actions">
            <a
              className="resume-dialog-action resume-dialog-action-primary"
              href={siteMeta.resumeUrl}
              download
              ref={primaryActionRef}
            >
              <Download aria-hidden="true" size={17} />
              Download PDF
            </a>
            <a
              className="resume-dialog-action"
              href={siteMeta.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" size={17} />
              Open in new tab
            </a>
            <button
              className="resume-dialog-close"
              type="button"
              aria-label="Close résumé preview"
              onClick={requestClose}
            >
              <X aria-hidden="true" size={20} />
            </button>
          </div>
        </header>

        <div className="resume-dialog-preview" data-status={previewStatus}>
          {isOpen ? (
            <iframe
              src={`${siteMeta.resumeUrl}#view=FitH&toolbar=0&navpanes=0`}
              title="Muhammad Rizky Syadrie's résumé"
              onLoad={() => setPreviewStatus("ready")}
              onError={() => setPreviewStatus("error")}
            />
          ) : null}

          {previewStatus === "loading" ? (
            <div className="resume-dialog-feedback" role="status">
              <LoaderCircle aria-hidden="true" />
              <span>Loading résumé preview…</span>
            </div>
          ) : null}

          {previewStatus === "error" ? (
            <div className="resume-dialog-feedback resume-dialog-feedback-error" role="alert">
              <CircleAlert aria-hidden="true" />
              <strong>The embedded preview could not load.</strong>
              <span>Open the PDF in a new tab to view it with your browser.</span>
              <a href={siteMeta.resumeUrl} target="_blank" rel="noreferrer">
                Open résumé <ExternalLink aria-hidden="true" size={16} />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
