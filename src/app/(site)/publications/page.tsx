import { redirect } from "next/navigation";

export default function PublicationsPage() {
  redirect("/knowledge-production?tab=publications");
}
