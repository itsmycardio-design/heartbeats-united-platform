import { Heart, Target, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-primary-light" />
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              Meet the Founder
            </h1>
            <p className="font-inter text-xl text-primary-foreground/90">
              Building a national movement for wellness, empowerment, and positive change
            </p>
          </div>
        </div>
      </section>

      {/* Founder Bio */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-poppins font-bold text-4xl mb-6">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="space-y-4 font-inter text-lg text-muted-foreground">
              <p>
                ItsMyCardio was born from a passion to create positive change in the lives of people across the nation. What started as a personal journey into fitness and wellness has evolved into a comprehensive platform addressing health, leadership, and empowerment.
              </p>
              <p>
                Our founder believes that true wellness encompasses physical health, mental strength, and social empowerment. Through evidence-based content and inspiring stories, we aim to be your trusted companion on the journey to a healthier, more empowered life.
              </p>
              <p>
                Today, ItsMyCardio reaches thousands of readers monthly, featuring expert contributors from various fields including medicine, fitness, politics, and personal development.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Button className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 font-poppins font-semibold">
                Book Me for Speaking
              </Button>
              <Button variant="outline" className="font-poppins font-semibold">
                View Media Kit
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
                alt="Founder"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-poppins font-bold text-4xl text-center mb-12">
            Our <span className="text-primary">Mission & Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-card text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Our Mission</h3>
              <p className="font-inter text-muted-foreground">
                To empower individuals through education, inspiration, and community, fostering a healthier and more engaged nation.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-card text-center">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Our Values</h3>
              <p className="font-inter text-muted-foreground">
                Integrity, inclusivity, and evidence-based information guide everything we do. We believe in authentic storytelling and real impact.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-card text-center">
              <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-3">Our Community</h3>
              <p className="font-inter text-muted-foreground">
                A diverse community of readers, contributors, and partners united in the pursuit of wellness and positive change.
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
