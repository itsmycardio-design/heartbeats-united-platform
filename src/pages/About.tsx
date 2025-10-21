import { Heart, Target, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import founderImage from "@/assets/founder-isaac.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="font-poppins font-bold text-5xl lg:text-6xl mb-6">
              Meet the Founder
            </h1>
            <p className="font-inter text-xl">
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
              Isaac Ashika Amwayi
            </h2>
            <p className="font-poppins text-2xl text-primary mb-6">
              Your Go-To Writer for Impactful Words
            </p>
            <div className="space-y-4 font-inter text-lg text-muted-foreground">
              <p>
                Isaac Ashika Amwayi is a passionate and highly skilled writer known for turning ideas into powerful written expressions. With a gift for communication and a reputation built across various writing fields, Isaac brings excellence to every project he undertakes.
              </p>
              <p>
                His expertise spans article writing, academic papers, blog content, research projects, proposals, and more. Beyond traditional writing, Isaac shines in areas like scriptwriting, social media management, speech writing, manifesto drafting, and campaign planning.
              </p>
              <p>
                His work is defined by clarity, depth, and creativity — all rooted in a strong understanding of the audience's needs. What sets Isaac apart is his belief that writing is more than just words; it's a tool for influence, transformation, and connection.
              </p>
              <p>
                Whether he's crafting academic papers, digital content, political speeches, or campaign narratives, Isaac blends intellect, authenticity, and purpose to deliver content that resonates. Dedicated, versatile, and passionate, Isaac continues to set the standard for purposeful writing that inspires, informs, and drives change.
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
                src={founderImage}
                alt="Isaac Ashika Amwayi - Founder"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-poppins font-bold text-4xl text-center mb-12">
            Our <span className="text-primary">Mission & Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-xl text-center">
...
            </div>
            <div className="bg-card border border-border p-8 rounded-xl text-center">
...
            </div>
            <div className="bg-card border border-border p-8 rounded-xl text-center">
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
