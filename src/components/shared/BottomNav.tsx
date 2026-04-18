import { Link, useLocation } from "react-router-dom";
import { Heart, Zap, Hand } from "lucide-react";

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/medical-id",
      label: "Medical ID",
      icon: Heart,
    },
    {
      path: "/phrases",
      label: "Phrase Pad",
      icon: Zap,
    },
    {
      path: "/fingerspell",
      label: "Fingerspell",
      icon: Hand,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-40">
      <div className="flex h-14">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-center transition-colors"
            >
              <Icon
                size={24}
                className={active ? "text-primary" : "text-text-muted"}
              />
              <span
                className={`text-xs font-medium ${
                  active ? "text-primary" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
