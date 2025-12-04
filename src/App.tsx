import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Fitness from "./pages/Fitness";
import Health from "./pages/Health";
import Politics from "./pages/Politics";
import Lifestyle from "./pages/Lifestyle";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import WritersDashboard from "./pages/WritersDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Partnership from "./pages/Partnership";
import Education from "./pages/Education";
import Inspiration from "./pages/Inspiration";
import Quotes from "./pages/Quotes";
import Speaker from "./pages/Speaker";
import MediaKit from "./pages/MediaKit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/fitness" element={<Fitness />} />
                <Route path="/health" element={<Health />} />
                <Route path="/politics" element={<Politics />} />
                <Route path="/lifestyle" element={<Lifestyle />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/writer" element={<WritersDashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route path="/education" element={<Education />} />
                <Route path="/inspiration" element={<Inspiration />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/speaker" element={<Speaker />} />
                <Route path="/media-kit" element={<MediaKit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
