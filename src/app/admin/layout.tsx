import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  // If not authenticated, render children directly (login page)
  if (!authed) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
