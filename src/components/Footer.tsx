import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

      if (error) throw error;

      toast.success("Successfully subscribed to the newsletter!");
      setEmail("");
    } catch (error: any) {
      if (error.message.includes("duplicate")) {
        toast.error("This email is already subscribed!");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-poppins font-bold text-xl mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-background">Ukweli Media</span>
            </Link>
            <p className="font-inter text-sm text-background/70 mb-6 leading-relaxed">
              Kenya's trusted platform delivering authentic news, insightful analysis, and empowering stories across fitness, health, politics, and lifestyle.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center text-background hover:text-primary-foreground transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center text-background hover:text-primary-foreground transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center text-background hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center text-background hover:text-primary-foreground transition-all"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-4 text-background">
              Categories
            </h3>
            <ul className="space-y-3 font-inter text-sm">
              <li>
                <Link to="/health" className="text-background/70 hover:text-primary transition-colors">
                  Health & Education
                </Link>
              </li>
              <li>
                <Link to="/fitness" className="text-background/70 hover:text-primary transition-colors">
                  Fitness & Wellness
                </Link>
              </li>
              <li>
                <Link to="/politics" className="text-background/70 hover:text-primary transition-colors">
                  Politics & Leadership
                </Link>
              </li>
              <li>
                <Link to="/lifestyle" className="text-background/70 hover:text-primary transition-colors">
                  Lifestyle & Inspiration
                </Link>
              </li>
              <li>
                <Link to="/quotes" className="text-background/70 hover:text-primary transition-colors">
                  Quotes
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-4 text-background">
              Quick Links
            </h3>
            <ul className="space-y-3 font-inter text-sm">
              <li>
                <Link to="/blog" className="text-background/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/partnership" className="text-background/70 hover:text-primary transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link to="/media-kit" className="text-background/70 hover:text-primary transition-colors">
                  Media Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider mb-4 text-background">
              Stay Updated
            </h3>
            <p className="font-inter text-sm text-background/70 mb-4">
              Get weekly insights delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-6">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 font-inter text-sm bg-background/10 border-background/20 text-background placeholder:text-background/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading}
                size="icon"
                className="bg-primary hover:bg-primary/90 shrink-0"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </form>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@its-mycardio.co.ke" className="hover:text-primary transition-colors">
                  info@its-mycardio.co.ke
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+254732555063" className="hover:text-primary transition-colors">
                  0732 555 063
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p className="font-inter">
              © {new Date().getFullYear()} Ukweli Media Hub. All rights reserved.
            </p>
            <p className="font-inter text-xs">
              Developed by <span className="text-primary">Laban Panda Khisa</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
