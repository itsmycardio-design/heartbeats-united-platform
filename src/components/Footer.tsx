import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { rateLimitedSubmit } from "@/lib/rateLimitedSubmit";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const result = await rateLimitedSubmit('subscribe', { email });
      
      if (!result.success) {
        if (result.error?.includes('subscribed')) {
          toast.error("Already subscribed!");
        } else if (result.retryAfter) {
          toast.error(`${result.error} Please wait ${result.retryAfter} seconds.`);
        } else {
          toast.error(result.error || "Failed to subscribe.");
        }
        return;
      }
      
      toast.success("Successfully subscribed!");
      setEmail("");
    } catch (error: unknown) {
      toast.error("Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">UKWELI MEDIA</h3>
            <p className="text-sm text-secondary-foreground/70 mb-4 leading-relaxed">
              Kenya's trusted platform delivering authentic news, insightful analysis, and empowering stories.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["Health", "Fitness", "Politics", "Lifestyle", "Education", "Inspiration"].map((cat) => (
                <li key={cat}>
                  <Link to={`/${cat.toLowerCase()}`} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[["Blog", "/blog"], ["About Us", "/about"], ["Contact", "/contact"], ["Privacy Policy", "/"], ["Terms", "/"]].map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Newsletter</h3>
            <p className="text-sm text-secondary-foreground/70 mb-4">Get weekly updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 text-sm bg-secondary-foreground/10 border-secondary-foreground/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                maxLength={255}
              />
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark">
                <Mail className="w-4 h-4" />
              </Button>
            </form>
            <div className="mt-4 text-sm text-secondary-foreground/70">
              <a href="mailto:info@its-mycardio.co.ke" className="flex items-center gap-2 hover:text-primary">
                <Mail className="w-4 h-4" /> info@its-mycardio.co.ke
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-secondary-foreground/60">
          © {new Date().getFullYear()} Ukweli Media Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
