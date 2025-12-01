import { Mail, MessageSquare, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-muted py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              Let's <span className="text-primary">Connect</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground">
              Whether you're interested in partnerships, speaking engagements, or collaborations, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-2">Email</h3>
            <a href="mailto:info@its-mycardio.co.ke" className="font-inter text-sm text-primary hover:underline">
              info@its-mycardio.co.ke
            </a>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-2">Phone</h3>
            <a href="tel:0732555063" className="font-inter text-sm text-primary hover:underline">
              0732 555 063
            </a>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-pink-500" />
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-2">Message</h3>
            <p className="font-inter text-sm text-muted-foreground">
              Send us a message below
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border p-8 lg:p-12 rounded-2xl">
            <h2 className="font-poppins font-bold text-3xl mb-6 text-center">
              Send Us a <span className="text-primary">Message</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter text-sm font-medium mb-2 block">
                    Name *
                  </label>
                  <Input
                    required
                    placeholder="Your full name"
                    className="font-inter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-2 block">
                    Email *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="your@email.com"
                    className="font-inter"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="font-inter text-sm font-medium mb-2 block">
                  Subject *
                </label>
                <Input
                  required
                  placeholder="What's this about?"
                  className="font-inter"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="font-inter text-sm font-medium mb-2 block">
                  Message *
                </label>
                <Textarea
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  className="font-inter resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 font-poppins font-semibold text-lg h-12"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-poppins font-bold text-3xl mb-4">
            Follow Our <span className="text-primary">Journey</span>
          </h2>
          <p className="font-inter text-muted-foreground mb-8">
            Stay connected on social media for daily inspiration and updates
          </p>
          <div className="flex justify-center gap-4">
            {["Facebook", "Twitter", "Instagram", "YouTube", "LinkedIn"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="px-6 py-3 bg-card border border-border hover:bg-primary/20 hover:text-primary rounded-lg font-inter font-medium transition-all hover:shadow-hover"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
