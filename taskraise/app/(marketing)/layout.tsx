import NavigationBar from "@/components/navigation/Navigationbar";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-violet-100 to-white">
      <NavigationBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
