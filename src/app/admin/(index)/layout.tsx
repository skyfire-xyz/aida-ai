export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      {children}
    </div>
  );
}
