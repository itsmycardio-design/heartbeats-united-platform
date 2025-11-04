import { Heart, Target, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import founderImage from "@/assets/founder-isaac.jpg";

interface FounderSettings {
  name: string;
  title: string;
  bio: string;
  image_url: string;
}

const About = () => {
  const [founder, setFounder] = useState<FounderSettings>({
    name: "Isaac Ashika Amwayi",
    title: "Your Go-To Writer for Impactful Words",
    bio: "Isaac Ashika Amwayi is a passionate and highly skilled writer known for turning ideas into powerful written expressions.",
    image_url: founderImage
  });

  useEffect(() => {
    fetchFounderSettings();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('founder-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'founder_settings'
        },
        () => {
          fetchFounderSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              About Ukweli Media Hub
            </h1>
            <p className="font-inter text-xl">
              Kenya's trusted source for authentic news, empowering stories, and community transformation
            </p>
          </div>
        </div>
      </section>

      {/* Founder Bio */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-poppins font-bold text-4xl mb-6">
              {founder.name}
            </h2>
            <p className="font-poppins text-2xl text-primary mb-6">
              {founder.title}
            </p>
            <div className="space-y-4 font-inter text-lg text-muted-foreground">
              <p style={{ whiteSpace: 'pre-wrap' }}>{founder.bio}</p>
            </div>
            <div className="mt-8 flex gap-4">
              <Link to="/speaker">
                <Button className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 font-poppins font-semibold">
                  Book Me for Speaking
                </Button>
              </Link>
              <Link to="/media-kit">
                <Button variant="outline" className="font-poppins font-semibold">
                  View Media Kit
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
              <img
                src={founder.image_url || founderImage}
                alt={`${founder.name} - Founder`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-poppins font-bold text-4xl text-center mb-16">
            Our <span className="text-primary">Mission & Vision</span>
          </h2>
          
          {/* Mission */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-card border border-border p-8 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-2xl mb-4">Our Mission</h3>
                  <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                    Ukweli Media Hub is committed to delivering truth-centered journalism and empowering content that transforms lives across Kenya. We provide authentic, well-researched stories covering fitness, health, politics, and lifestyle—fostering informed communities, inspiring positive action, and amplifying voices that matter. Our mission is to be the trusted platform where Kenyans find reliable information, meaningful perspectives, and the tools to build healthier, more engaged communities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-card border border-border p-8 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-2xl mb-4">Our Vision</h3>
                  <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                    To be East Africa's leading media platform for truth, empowerment, and community transformation. We envision a Kenya where every citizen has access to reliable, unbiased information that enables informed decision-making, promotes wellness, and drives positive social change. Through authentic storytelling and impactful journalism, we aim to create a ripple effect of transformation—building stronger communities, inspiring leadership, and shaping a brighter, more equitable future for all Kenyans.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <h3 className="font-poppins font-bold text-3xl text-center mb-8">
            Our Core <span className="text-primary">Values</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-xl text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Empowerment</h3>
              <p className="font-inter text-muted-foreground">
                We believe in empowering every individual with knowledge, inspiration, and tools to transform their lives and communities.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-xl text-center">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Excellence</h3>
              <p className="font-inter text-muted-foreground">
                We are committed to delivering high-quality, well-researched, and impactful content that sets the standard for excellence.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-xl text-center">
              <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Community</h3>
              <p className="font-inter text-muted-foreground">
                We foster a vibrant, inclusive community of readers, contributors, and partners united in the pursuit of wellness and positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <h2 className="font-poppins font-bold text-4xl text-center mb-12">
          Impact & <span className="text-primary">Achievements</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "50K+", label: "Monthly Readers" },
            { value: "200+", label: "Articles Published" },
            { value: "25+", label: "Expert Contributors" },
            { value: "10K+", label: "Newsletter Subscribers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-poppins font-bold text-5xl text-primary mb-2">
                {stat.value}
              </div>
              <div className="font-inter text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
