import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Calendar, Users, Mail, Phone, Building } from "lucide-react";

const Speaker = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    event_date: "",
    event_type: "",
    audience_size: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: `Speaking Engagement Request - ${formData.event_type}`,
          message: `
Event Type: ${formData.event_type}
Organization: ${formData.organization}
Phone: ${formData.phone}
Event Date: ${formData.event_date}
Expected Audience Size: ${formData.audience_size}

Additional Details:
${formData.message}
          `.trim()
        }]);

      if (error) throw error;

      toast.success("Your booking request has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        event_date: "",
        event_type: "",
        audience_size: "",
        message: ""
      });
    } catch (error: any) {
      toast.error("Failed to submit request. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Mic className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              Book Isaac for <span className="text-primary">Speaking</span>
            </h1>
            <p className="font-inter text-xl text-muted-foreground">
              Transform your event with powerful storytelling and authentic insights on journalism, 
              writing, and community empowerment
            </p>
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <h2 className="font-poppins font-bold text-4xl text-center mb-12">
          Speaking <span className="text-primary">Topics</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-card border border-border p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-3">Authentic Journalism</h3>
            <p className="font-inter text-muted-foreground">
              The power of truth-centered journalism in transforming communities and building trust
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-3">Community Empowerment</h3>
            <p className="font-inter text-muted-foreground">
              Strategies for using media and storytelling to drive positive social change
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-poppins font-semibold text-xl mb-3">Content Creation</h3>
            <p className="font-inter text-muted-foreground">
              Mastering the art of impactful writing that resonates and inspires action
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-poppins font-bold text-4xl text-center mb-4">
              Request a <span className="text-primary">Booking</span>
            </h2>
            <p className="font-inter text-center text-muted-foreground mb-8">
              Fill out the form below and we'll get back to you within 24-48 hours
            </p>
            
            <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter font-medium mb-2 block">Your Name *</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-inter font-medium mb-2 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter font-medium mb-2 block">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-inter font-medium mb-2 block">Organization *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Your Company"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter font-medium mb-2 block">Event Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      required
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-inter font-medium mb-2 block">Event Type *</label>
                  <Input
                    required
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    placeholder="Conference, Workshop, etc."
                  />
                </div>
              </div>

              <div>
                <label className="font-inter font-medium mb-2 block">Expected Audience Size</label>
                <Input
                  value={formData.audience_size}
                  onChange={(e) => setFormData({ ...formData, audience_size: e.target.value })}
                  placeholder="e.g., 50-100 attendees"
                />
              </div>

              <div>
                <label className="font-inter font-medium mb-2 block">Additional Details</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your event, desired topics, duration, and any other relevant information..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 font-poppins font-semibold"
              >
                {loading ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Speaker;
