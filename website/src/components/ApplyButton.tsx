import type { Job } from "../types";
import { applyHref } from "../lib";

export default function ApplyButton({
  job,
  className = "apply-btn",
}: {
  job: Job;
  className?: string;
}) {
  return (
    <a className={className} href={applyHref(job)} target="_blank" rel="noreferrer">
      Apply
    </a>
  );
}
