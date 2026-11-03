
import { Overview } from "@/components/dashboard/overview";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <Overview />
        </main>
      </div>
    </div>
  );
}
