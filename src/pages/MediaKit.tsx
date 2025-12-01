import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Award, Users, TrendingUp, Globe, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import founderImage from "@/assets/founder-isaac.jpg";

interface FounderSettings {
  name: string;
  title: string;
  bio: string;
  image_url: string;
}

const MediaKit = () => {
  const [founder, setFounder] = useState<FounderSettings>({
    name: "Isaac Ashika Amwayi",
    title: "Your Go-To Writer for Impactful Words",
    bio: "Isaac Ashika Amwayi is a passionate and highly skilled writer known for turning ideas into powerful written expressions.",
    image_url: founderImage
  });

  useEffect(() => {
    fetchFounderSettings();
  }, []);

  const fetchFounderSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("founder_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFounder(data);
      }
    } catch (error) {
      console.error("Error fetching founder settings:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
                Media <span className="text-primary">Kit</span>
              </h1>
              <p className="font-inter text-xl text-muted-foreground">
                Everything you need to know about Isaac Ashika Amwayi and Ukweli Media Hub
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 sticky top-8">
                <img
                  src={founder.image_url || founderImage}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="font-poppins font-bold text-4xl mb-2">{founder.name}</h2>
                <p className="font-poppins text-2xl text-primary mb-4">{founder.title}</p>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="font-poppins font-semibold text-2xl mb-4">About</h3>
                <p className="font-inter text-muted-foreground leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                  {founder.bio}
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <h3 className="font-poppins font-semibold text-2xl mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {["Journalism", "Content Writing", "Community Development", "Public Speaking", "Digital Media", "Editorial Leadership"].map((expertise) => (
                    <span key={expertise} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-inter font-medium">
                      {expertise}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-poppins font-bold text-4xl text-center mb-12">
              Platform <span className="text-primary">Impact</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, value: "50K+", label: "Monthly Readers" },
                { icon: TrendingUp, value: "200+", label: "Published Articles" },
                { icon: Award, value: "25+", label: "Contributors" },
                { icon: Globe, value: "10K+", label: "Newsletter Subscribers" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-poppins font-bold text-4xl text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="font-inter text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins font-bold text-4xl text-center mb-12">
            Content <span className="text-primary">Categories</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Health & Wellness", desc: "Evidence-based health tips and wellness guides" },
              { name: "Fitness", desc: "Workout routines and fitness transformation stories" },
              { name: "Politics", desc: "Political analysis and civic engagement" },
              { name: "Lifestyle", desc: "Modern living and personal development" },
              { name: "Education", desc: "Learning resources and educational insights" },
              { name: "Inspiration", desc: "Motivational stories and success journeys" }
            ].map((category) => (
              <div key={category.name} className="bg-card border border-border p-6 rounded-xl">
                <h3 className="font-poppins font-semibold text-xl mb-2">{category.name}</h3>
                <p className="font-inter text-muted-foreground">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-poppins font-bold text-4xl text-center mb-12">
              Speaking <span className="text-primary">Topics</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="font-poppins font-semibold text-xl mb-3">Truth-Centered Journalism</h3>
                <p className="font-inter text-muted-foreground">
                  The importance of authentic reporting in building trust and transforming communities
                </p>
              </div>
              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="font-poppins font-semibold text-xl mb-3">Digital Content Strategy</h3>
                <p className="font-inter text-muted-foreground">
                  Creating impactful content that resonates with modern audiences
                </p>
              </div>
              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="font-poppins font-semibold text-xl mb-3">Community Empowerment</h3>
                <p className="font-inter text-muted-foreground">
                  Using media and storytelling to drive positive social change
                </p>
              </div>
              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="font-poppins font-semibold text-xl mb-3">Editorial Excellence</h3>
                <p className="font-inter text-muted-foreground">
                  Building and leading high-performing content teams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-poppins font-bold text-4xl mb-6">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="font-inter text-xl text-muted-foreground mb-8">
            For speaking engagements, media inquiries, or partnership opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href="mailto:info@its-mycardio.co.ke" className="flex items-center gap-2 font-inter text-lg text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
              info@its-mycardio.co.ke
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a href="tel:+254732555063" className="flex items-center gap-2 font-inter text-lg text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              0732 555 063
            </a>
          </div>
          <div className="flex gap-4 justify-center">
            <Link to="/speaker">
              <Button className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 font-poppins font-semibold">
                <Mail className="w-4 h-4 mr-2" />
                Contact for Speaking
              </Button>
            </Link>
            <Button variant="outline" className="font-poppins font-semibold" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MediaKit;
