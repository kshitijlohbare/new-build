import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-moody-light/20 dark:from-gray-950 dark:via-gray-950 dark:to-moody-primary/5">
      <AppNavbar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;