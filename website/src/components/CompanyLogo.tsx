import { companyAccent, initials } from "../lib";

export default function CompanyLogo({
  id,
  name,
  size = 44,
}: {
  id: string;
  name: string;
  size?: number;
}) {
  const bg = companyAccent[id] ?? "#5B4DFF";
  return (
    <span className="mono" style={{ width: size, height: size, background: bg, fontSize: size * 0.34 }}>
      {initials(name)}
    </span>
  );
}
