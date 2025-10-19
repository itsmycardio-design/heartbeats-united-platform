export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  featured?: boolean;
}

export const posts: Post[] = [
  {
    id: "1",
    title: "10 Essential Cardio Exercises for Heart Health",
    excerpt: "Discover the most effective cardio exercises that strengthen your heart and improve overall cardiovascular health. From running to swimming, we cover the science-backed workouts.",
    category: "Fitness",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    author: "Dr. Sarah Johnson",
    featured: true,
  },
  {
    id: "2",
    title: "Understanding Blood Pressure: A Complete Guide",
    excerpt: "Learn everything you need to know about blood pressure management, from reading numbers to lifestyle changes that make a real difference in your heart health.",
    category: "Health",
    date: "Jan 12, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    author: "Medical Team",
    featured: true,
  },
  {
    id: "3",
    title: "Women in Leadership: Breaking Barriers in 2025",
    excerpt: "Celebrating the rise of women leaders across politics and business. Explore inspiring stories of resilience, strategy, and impact in today's changing landscape.",
    category: "Politics",
    date: "Jan 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    author: "Maria Rodriguez",
    featured: true,
  },
  {
    id: "4",
    title: "5 Morning Rituals for a Productive Day",
    excerpt: "Transform your mornings with these science-backed rituals that boost energy, focus, and overall well-being. Start your day with purpose and positivity.",
    category: "Lifestyle",
    date: "Jan 8, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    author: "Jessica Lee",
  },
  {
    id: "5",
    title: "Nutrition Tips for Athletes: Fuel Your Performance",
    excerpt: "Optimize your athletic performance with proper nutrition. Learn what to eat before, during, and after workouts for maximum results and recovery.",
    category: "Fitness",
    date: "Jan 5, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    author: "Coach Mike Stevens",
  },
  {
    id: "6",
    title: "Mental Health Matters: Breaking the Stigma",
    excerpt: "Join the conversation about mental wellness. Discover resources, coping strategies, and inspiring stories of recovery and resilience.",
    category: "Health",
    date: "Jan 3, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80",
    author: "Dr. Emily Chen",
  },
  {
    id: "7",
    title: "Youth Activism: The Voice of the Next Generation",
    excerpt: "Young leaders are reshaping political discourse. Explore how youth activism is driving change on climate, education, and social justice fronts.",
    category: "Politics",
    date: "Dec 30, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    author: "Alex Thompson",
  },
  {
    id: "8",
    title: "Finding Balance: Work, Life, and Self-Care",
    excerpt: "Practical strategies for maintaining balance in our fast-paced world. Learn to prioritize what matters most and cultivate sustainable habits.",
    category: "Lifestyle",
    date: "Dec 28, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
    author: "Sophie Anderson",
  },
  {
    id: "9",
    title: "The Power of Gratitude: Transform Your Mindset",
    excerpt: "Discover how practicing gratitude can improve mental health, relationships, and overall life satisfaction. Simple exercises to start today.",
    category: "Inspiration",
    date: "Dec 25, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80",
    author: "Rachel Green",
  },
];
