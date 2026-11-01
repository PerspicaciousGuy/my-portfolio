import { site } from "@/data/site";
import { shareCard, SHARE_SIZE } from "@/lib/share-card";

export const alt = `${site.name} — ${site.role}`;
export const size = SHARE_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return shareCard({ kind: "home" });
}
