import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, LayoutDashboard, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: "Latest", path: "/blog" },
  { name: "Health", path: "/health" },
  { name: "Fitness", path: "/fitness" },
  { name: "Politics", path: "/politics" },
  { name: "Lifestyle", path: "/lifestyle" },
  { name: "Education", path: "/education" },
  { name: "Inspiration", path: "/inspiration" },
  { name: "Quotes", path: "/quotes" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin, isWriter } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar - Logo and Search */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">UKWELI</span>
              <span className="text-2xl font-bold text-foreground ml-1">MEDIA</span>
            </Link>

            {/* Desktop Search & User */}
            <div className="flex items-center gap-3">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="hidden md:flex items-center">
                  <Input
                    type="search"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-9 text-sm"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:flex"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {/* User Menu - Desktop */}
              <div className="hidden md:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {isWriter && !isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/writer" className="flex items-center cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Writer Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/auth">
                    <Button variant="default" size="sm" className="bg-primary hover:bg-primary-dark text-primary-foreground">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Tuko Style */}
      <nav className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center h-10 overflow-x-auto hide-scrollbar">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive("/")
                  ? "bg-primary-dark text-primary-foreground"
                  : "text-primary-foreground hover:bg-primary-dark"
              }`}
            >
              HOME
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(cat.path)
                    ? "bg-primary-dark text-primary-foreground"
                    : "text-primary-foreground hover:bg-primary-dark"
                }`}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground hover:bg-primary-dark flex items-center gap-1">
                  MORE
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="cursor-pointer">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="cursor-pointer">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/partnership" className="cursor-pointer">Partner With Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/media-kit" className="cursor-pointer">Media Kit</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Mobile Categories */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium ${
                  isActive("/") ? "text-primary bg-primary/10" : "text-foreground"
                }`}
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium ${
                    isActive(cat.path) ? "text-primary bg-primary/10" : "text-foreground"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              
              <div className="border-t border-border my-2 pt-2">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-muted-foreground"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-muted-foreground"
                >
                  Contact
                </Link>
              </div>

              {/* Mobile User Actions */}
              <div className="border-t border-border pt-3 mt-3">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-foreground"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {isWriter && !isAdmin && (
                      <Link
                        to="/writer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-foreground"
                      >
                        Writer Dashboard
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-foreground"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-destructive"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-bold text-primary"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
