import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, User, LogOut, Settings, LayoutDashboard, Search, ChevronDown } from "lucide-react";
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

const mainNavigation = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const categories = [
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
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs font-inter">
            <div className="hidden md:flex items-center gap-4 text-muted-foreground">
              <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <Link to="/partnership" className="text-muted-foreground hover:text-primary transition-colors">
                Partner with Us
              </Link>
              <Link to="/media-kit" className="text-muted-foreground hover:text-primary transition-colors">
                Media Kit
              </Link>
              <Link to="/speaker" className="text-muted-foreground hover:text-primary transition-colors">
                Speaker
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-poppins font-bold text-xl group">
            <Heart className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Ukweli Media
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 rounded-md font-inter text-sm font-medium transition-colors text-foreground hover:text-primary hover:bg-muted flex items-center gap-1">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.path} asChild>
                    <Link to={cat.path} className="cursor-pointer">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 h-9 text-sm"
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

            {/* User Menu */}
            <div className="hidden lg:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
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
                <Button asChild variant="default" size="sm" className="font-poppins font-semibold">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Tabs - Desktop */}
        <div className="hidden lg:block border-t border-border">
          <div className="flex items-center gap-1 py-2 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`px-3 py-1.5 rounded-md font-inter text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive(cat.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <div className="flex flex-col gap-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md font-inter text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="py-2">
                <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 block font-inter text-sm transition-colors ${
                      isActive(cat.path)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-md font-inter text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isWriter && !isAdmin && (
                    <Link
                      to="/writer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-md font-inter text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
                    >
                      Writer Dashboard
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-md font-inter text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
                  >
                    Settings
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild className="mt-2 w-full font-poppins font-semibold">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
