import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="glass dark:glass-dark border-t border-white/20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-poppins font-bold text-xl mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                ItsMyCardio
              </span>
            </Link>
            <p className="font-inter text-sm text-muted-foreground mb-4">
              National platform for fitness, wellness, leadership, and empowerment stories that inspire.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg glass dark:glass-dark hover:bg-primary/20 hover:text-primary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass dark:glass-dark hover:bg-primary/20 hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass dark:glass-dark hover:bg-primary/20 hover:text-primary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg glass dark:glass-dark hover:bg-primary/20 hover:text-primary transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 font-inter text-sm">
              <li>
                <Link to="/fitness" className="text-muted-foreground hover:text-primary transition-colors">
                  Fitness & Wellness
                </Link>
              </li>
              <li>
                <Link to="/health" className="text-muted-foreground hover:text-primary transition-colors">
                  Health & Education
                </Link>
              </li>
              <li>
                <Link to="/politics" className="text-muted-foreground hover:text-primary transition-colors">
                  Politics & Leadership
                </Link>
              </li>
              <li>
                <Link to="/lifestyle" className="text-muted-foreground hover:text-primary transition-colors">
                  Lifestyle & Inspiration
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 font-inter text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Media Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Join the Heartbeat</h3>
            <p className="font-inter text-sm text-muted-foreground mb-4">
              Get weekly inspiration and wellness tips delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 font-inter text-sm"
              />
              <Button className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 shrink-0">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-center font-inter text-sm text-muted-foreground">
            © 2025 ItsMyCardio — All Rights Reserved. Built with 🩷 for national wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};
