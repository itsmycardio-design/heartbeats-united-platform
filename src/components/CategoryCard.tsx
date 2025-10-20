import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export const CategoryCard = ({
  title,
  description,
  icon: Icon,
  path,
  color,
}: CategoryCardProps) => {
  return (
    <Link
      to={path}
      className="group bg-card border border-border rounded-xl p-6 hover:shadow-hover transition-all duration-300 animate-scale-in"
    >
      <div className={`w-14 h-14 rounded-lg ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        <Icon className="w-7 h-7 text-background" />
      </div>
      <h3 className="font-poppins font-bold text-xl mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="font-inter text-sm text-muted-foreground">
        {description}
      </p>
    </Link>
  );
};
