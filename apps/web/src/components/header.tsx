import { Link } from "@tanstack/react-router";

import UserMenu from "./user-menu";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <nav className="flex gap-4 text-lg">
          <Link to="/hiring-processes">Hiring Processes</Link>
        </nav>
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
