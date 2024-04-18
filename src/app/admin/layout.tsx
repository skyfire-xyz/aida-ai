export const metadata = {
  title: "Admin UI",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`font-jones h-screen bg-[#002341]`}>{children}</div>;
}
