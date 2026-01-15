import { Header } from "@/components/layout/header";
import { FloatingPlayer } from "@/components/shared/floating-player";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
      <FloatingPlayer />
    </div>
  );
}
