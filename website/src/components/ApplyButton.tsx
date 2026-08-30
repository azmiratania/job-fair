import type { Job } from "../types";
import { applyMeta } from "../lib";

export default function ApplyButton({
  job,
  className = "apply-btn",
}: {
  job: Job;
  className?: string;
}) {
  const { href, label, hint } = applyMeta(job);
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" title={hint}>
      {label}
    </a>
  );
}
