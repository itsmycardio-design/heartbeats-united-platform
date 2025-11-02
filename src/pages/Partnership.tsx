import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Mail, Phone, Building2, CheckCircle } from "lucide-react";
import { usePageView } from "@/hooks/usePageView";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Partnership = () => {
  usePageView("/partnership");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: `Partnership Inquiry from ${formData.organization}`,
          message: `Organization: ${formData.organization}\nPhone: ${formData.phone}\n\n${formData.message}`
        }]);

      if (error) throw error;

      toast({
        title: "Partnership inquiry sent!",
        description: "We'll get back to you within 48 hours.",
      });

      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send inquiry",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-purple-500/10 py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Handshake className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              Partner with <span className="text-primary">Ukweli Media Hub</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground">
              Join us in promoting wellness, truth, and empowerment. Together, we can create meaningful impact and reach communities that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <h2 className="font-poppins font-bold text-4xl text-center mb-12">
          Why Partner with Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Wide Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access to thousands of engaged readers across Kenya and beyond, passionate about wellness and positive change.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Authentic Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We prioritize truth and quality. Your brand will be associated with credible, well-researched content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Collaborate on initiatives that promote health awareness, education, and community empowerment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Start a Partnership Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Organization Name
                      </Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required
                        placeholder="Your Company"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0712345678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Partnership Details</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                      placeholder="Tell us about your partnership ideas, goals, and how we can collaborate..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-poppins font-semibold"
                  >
                    {loading ? "Sending..." : "Submit Partnership Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-poppins font-semibold text-2xl mb-6">
            Or Reach Out Directly
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <a href="mailto:info@its-MyCardio.co.ke" className="hover:text-primary transition-colors">
                info@its-MyCardio.co.ke
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <a href="tel:0732555063" className="hover:text-primary transition-colors">
                0732 555 063
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnership;
