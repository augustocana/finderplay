import { Home, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Início", path: "/" },
  { icon: Search, label: "Jogos", path: "/games" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 px-4 py-2 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-primary" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
