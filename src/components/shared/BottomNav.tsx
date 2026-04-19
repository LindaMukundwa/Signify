import { Link, useLocation } from "react-router-dom";
import { Heart, Zap, Hand } from "lucide-react";

const navItems = [
  { path: "/medical-id", label: "Medical ID", icon: Heart},
  { path: "/phrases", label: "Phrase Pad", icon: Zap },
  { path: "/fingerspell", label: "Fingerspell", icon: Hand },
];

export const BottomNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav id="bottomNav" className="bg-surface border-t border-border z-40">
      <div className="max-w-app mx-auto flex h-14">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-center transition-colors"
            >
              <Icon
                size={22}
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
