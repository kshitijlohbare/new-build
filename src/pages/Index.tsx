import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Heart, Sparkles, Target, Users, BookOpen, Trophy, ArrowRight, Play } from "lucide-react";
import HomeHeader from "@/components/layout/HomeHeader";
import GlobalSidebar from "@/components/layout/GlobalSidebar";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    {
      id: "learn",
      icon: BookOpen,
      title: "Learn & Grow",
      description: "Explore psychology, neuroscience, and wisdom concepts to understand your mind better",
      color: "#04C4D5",
      gradient: "from-[#04C4D5] to-[#148BAF]",
      path: "/learn"
    },
    {
      id: "practice",
      icon: Target,
      title: "Daily Practices",
      description: "Build powerful habits with mindfulness, meditation, and evidence-based techniques",
      color: "#FCDF4D",
      gradient: "from-[#FCDF4D] to-[#F4D03F]",
      path: "/practices"
    },
    {
      id: "therapy",
      icon: Heart,
      title: "Professional Support",
      description: "Connect with licensed therapists and mental health professionals",
      color: "#FF6B6B",
      gradient: "from-[#FF6B6B] to-[#E74C3C]",
      path: "/therapist-listing"
    },
    {
      id: "community",
      icon: Users,
      title: "Community",
      description: "Share your journey and connect with others on the path to growth",
      color: "#A855F7",
      gradient: "from-[#A855F7] to-[#7C3AED]",
      path: "/community"
    }
  ];

  const stats = [
    { number: "1000+", label: "Concepts Learned", icon: Brain },
    { number: "50+", label: "Daily Practices", icon: Sparkles },
    { number: "100+", label: "Licensed Therapists", icon: Heart },
    { number: "5000+", label: "Community Members", icon: Users }
  ];

  const testimonials = [
    {
      quote: "This platform transformed how I understand my mind and emotions. The daily practices are life-changing.",
      author: "Sarah M.",
      role: "Wellness Enthusiast"
    },
    {
      quote: "The combination of learning and practice is perfect. I've never felt more in control of my mental health.",
      author: "David L.",
      role: "Professional"
    },
    {
      quote: "Finding the right therapist was seamless. The community support makes all the difference.",
      author: "Maria K.",
      role: "Student"
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#F0FDFF] via-white to-[#E6F9FA]">
      {/* Global sidebar */}
      <GlobalSidebar />
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#04C4D5]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#FCDF4D]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#FF6B6B]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-[#A855F7]/5 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>
      
      {/* Main container */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <HomeHeader />
        
        {/* Main content */}
        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#04C4D5]/10 border border-[#04C4D5]/20 mb-6">
                <Sparkles className="w-4 h-4 text-[#04C4D5] mr-2" />
                <span className="text-sm font-['Happy_Monkey'] text-[#148BAF] lowercase">
                  your journey to mental wellness starts here
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Happy_Monkey'] text-[#148BAF] mb-6 leading-tight">
                <span className="block">transform your</span>
                <span className="block text-[#04C4D5]">mind & soul</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#148BAF]/80 mb-8 max-w-3xl mx-auto font-['Happy_Monkey'] lowercase">
                discover the science of wellbeing through psychology, neuroscience, and ancient wisdom. 
                build daily practices, connect with professionals, and join a community committed to growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate('/learn')}
                  className="group flex items-center px-8 py-4 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-full font-['Happy_Monkey'] lowercase text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  start learning
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => navigate('/practices')}
                  className="flex items-center px-8 py-4 border-2 border-[#04C4D5] text-[#148BAF] rounded-full font-['Happy_Monkey'] lowercase text-lg hover:bg-[#04C4D5] hover:text-white transition-all duration-300"
                >
                  <Target className="w-5 h-5 mr-2" />
                  explore practices
                </button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-6xl mx-auto py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#04C4D5]/10 to-[#148BAF]/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-[#04C4D5]" />
                  </div>
                  <div className="text-3xl font-bold text-[#148BAF] mb-2 font-['Happy_Monkey']">{stat.number}</div>
                  <div className="text-sm text-[#148BAF]/70 font-['Happy_Monkey'] lowercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-7xl mx-auto py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-['Happy_Monkey'] text-[#148BAF] mb-4 lowercase">
                everything you need to thrive
              </h2>
              <p className="text-lg text-[#148BAF]/70 max-w-2xl mx-auto font-['Happy_Monkey'] lowercase">
                comprehensive tools and resources for your mental wellness journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => navigate(feature.path)}
                  className="group relative cursor-pointer"
                >
                  <div className={`
                    relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 
                    hover:bg-white/95 transition-all duration-300 hover:shadow-2xl hover:shadow-[${feature.color}]/10
                    transform hover:scale-105 hover:-translate-y-2
                  `}>
                    <div className={`
                      inline-flex items-center justify-center w-16 h-16 rounded-full mb-6
                      bg-gradient-to-r ${feature.gradient} text-white
                      group-hover:rotate-12 transition-transform duration-300
                    `}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-['Happy_Monkey'] text-[#148BAF] mb-4 lowercase">
                      {feature.title}
                    </h3>
                    
                    <p className="text-[#148BAF]/70 mb-6 font-['Happy_Monkey'] lowercase text-sm">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-[#04C4D5] font-['Happy_Monkey'] lowercase text-sm group-hover:translate-x-2 transition-transform duration-300">
                      explore now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                    
                    {/* Animated border */}
                    <div className={`
                      absolute inset-0 rounded-2xl border-2 border-transparent
                      ${hoveredFeature === feature.id ? `bg-gradient-to-r ${feature.gradient} bg-clip-border` : ''}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    `} style={{
                      background: hoveredFeature === feature.id ? 
                        `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${feature.color}, ${feature.color}80) border-box` : 
                        undefined
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="max-w-6xl mx-auto py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-['Happy_Monkey'] text-[#148BAF] mb-4 lowercase">
                stories of transformation
              </h2>
              <p className="text-lg text-[#148BAF]/70 font-['Happy_Monkey'] lowercase">
                hear from people who've transformed their lives
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group">
                  <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                      <div className="flex text-[#FCDF4D]">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="text-[#148BAF] mb-6 font-['Happy_Monkey'] lowercase italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] rounded-full flex items-center justify-center text-white font-['Happy_Monkey'] text-lg">
                        {testimonial.author[0]}
                      </div>
                      <div className="ml-4">
                        <div className="font-['Happy_Monkey'] text-[#148BAF] lowercase">{testimonial.author}</div>
                        <div className="text-sm text-[#148BAF]/70 font-['Happy_Monkey'] lowercase">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-4xl mx-auto py-16 text-center">
            <div className="relative p-12 rounded-3xl bg-gradient-to-r from-[#04C4D5]/10 via-[#148BAF]/10 to-[#04C4D5]/10 border border-[#04C4D5]/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-[#04C4D5]/5 to-[#148BAF]/5 rounded-3xl blur-xl"></div>
              
              <div className="relative z-10">
                <Trophy className="w-16 h-16 text-[#FCDF4D] mx-auto mb-6 animate-bounce" />
                
                <h2 className="text-3xl sm:text-4xl font-['Happy_Monkey'] text-[#148BAF] mb-6 lowercase">
                  ready to transform your life?
                </h2>
                
                <p className="text-lg text-[#148BAF]/80 mb-8 font-['Happy_Monkey'] lowercase">
                  join thousands of people who are already on their journey to better mental health and personal growth
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => navigate('/learn')}
                    className="group flex items-center px-8 py-4 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-full font-['Happy_Monkey'] lowercase text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    begin your journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/therapist-listing')}
                    className="flex items-center px-8 py-4 border-2 border-[#04C4D5] text-[#148BAF] rounded-full font-['Happy_Monkey'] lowercase text-lg hover:bg-[#04C4D5] hover:text-white transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    find support
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="max-w-7xl mx-auto py-12 border-t border-[#04C4D5]/20">
            <div className="text-center">
              <p className="text-[#148BAF]/60 font-['Happy_Monkey'] lowercase">
                made with ❤️ for your mental wellness journey
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;