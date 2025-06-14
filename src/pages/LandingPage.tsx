import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Brain, 
  Heart, 
  Calendar, 
  Award, 
  UserCheck, 
  TrendingUp, 
  Clock,
  Check,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto rotate through features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Daily Wellness Practices",
      description: "Build healthy habits with science-backed practices personalized to your needs.",
      icon: <Brain className="w-6 h-6 text-[#06C4D5]" />,
      stats: "15+ evidence-based practices"
    },
    {
      title: "Expert Therapist Matching",
      description: "Connect with licensed therapists specializing in your unique needs and preferences.",
      icon: <UserCheck className="w-6 h-6 text-[#06C4D5]" />,
      stats: "Vetted professional network"
    },
    {
      title: "Progress Tracking",
      description: "Visualize your journey with personalized insights and achievement tracking.",
      icon: <TrendingUp className="w-6 h-6 text-[#06C4D5]" />,
      stats: "Daily streaks & milestones"
    },
    {
      title: "Guided Meditation",
      description: "Access a library of guided meditations to reduce stress and improve focus.",
      icon: <Heart className="w-6 h-6 text-[#06C4D5]" />,
      stats: "5-30 minute sessions"
    }
  ];

  const testimonials = [
    {
      name: "Sarah J.",
      quote: "This platform helped me establish healthy habits I've been trying to build for years. The daily tracking keeps me accountable.",
      role: "Member since 2022"
    },
    {
      name: "Michael T.",
      quote: "Finding the right therapist used to be overwhelming. The matching system connected me with someone who truly understands my needs.",
      role: "Member since 2023"
    },
    {
      name: "Aisha K.",
      quote: "I love how easy it is to track my progress and see how far I've come. The achievements are a great motivator!",
      role: "Member since 2023"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9FCFD] to-white font-happy-monkey">
      {/* Floating nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm py-3 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-happy-monkey text-[#06C4D5] lowercase">Caktus Coco</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-[#208EB1] transition font-medium">Log In</Link>
            <Link to="/register" className="bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition">Sign Up</Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section with CSS animations instead of framer-motion */}
      <header className="w-full pt-24 pb-16 px-4 bg-[rgba(6,196,213,0.05)] animate-fade-in">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-happy-monkey text-[#06C4D5] mb-4 lowercase animate-fade-in-slow">
              Your <span className="text-[#208EB1]">Caktus Coco</span> Journey Starts Here
            </h1>
            
            <p className="text-gray-700 text-lg mb-8 animate-fade-in-slower">
              Personalized wellness practices, therapist matching, and progress tracking all in one place. Build habits that last and support your mental health journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-slowest">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white font-medium rounded-full px-8 py-3 text-lg shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[0px] transition flex items-center justify-center gap-2 group"
              >
                Get Started
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                to="/login" 
                className="text-[#208EB1] font-medium border border-[#208EB1] bg-white rounded-full px-8 py-3 text-lg hover:bg-[#E8F7FA] transition"
              >
                Log In
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-slide-in">
            <img 
              src="https://placehold.co/600x400/E8F7FA/208EB1?text=Caktus+Coco" 
              alt="Caktus Coco Platform" 
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Features Carousel */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-happy-monkey text-center text-[#208EB1] mb-12">
            Your Complete Caktus Coco Platform
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Feature Tabs */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-[#E8F7FA] shadow-md transform scale-[1.02]' 
                      : 'bg-white hover:bg-gray-50 hover:scale-[1.01]'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      activeFeature === index ? 'bg-[#06C4D5]/20' : 'bg-gray-100'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-happy-monkey text-gray-800">{feature.title}</h3>
                      <p className={`text-sm mt-1 ${
                        activeFeature === index ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {feature.description}
                      </p>
                      <div className="mt-2 text-xs font-happy-monkey text-[#06C4D5] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {feature.stats}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Feature Visualization */}
            <div 
              key={activeFeature}
              className="bg-[#F9FCFD] rounded-xl shadow-md p-6 h-[300px] flex items-center justify-center animate-fade-in"
            >
              <div className="text-center">
                <div className="mb-4 text-5xl flex justify-center">
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-xl font-happy-monkey text-[#208EB1] mb-2">{features[activeFeature].title}</h3>
                <p className="text-gray-600 mb-4">{features[activeFeature].description}</p>
                <span className="inline-block bg-[rgba(6,196,213,0.1)] text-[#208EB1] rounded-full px-3 py-1 text-xs font-happy-monkey">
                  {features[activeFeature].stats}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-[#F9FCFD]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-happy-monkey text-center text-[#208EB1] mb-8">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and tell us about your wellness goals and preferences.",
                icon: <UserCheck className="w-10 h-10 text-[#06C4D5]" />
              },
              {
                step: "2",
                title: "Build Your Routine",
                description: "Choose from science-backed practices that fit your lifestyle.",
                icon: <Calendar className="w-10 h-10 text-[#06C4D5]" />
              },
              {
                step: "3",
                title: "Track & Improve",
                description: "Monitor your progress, earn achievements, and connect with professionals.",
                icon: <Award className="w-10 h-10 text-[#06C4D5]" />
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 relative animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[#06C4D5] to-[#208EB1] rounded-full flex items-center justify-center text-white font-happy-monkey shadow">
                  {step.step}
                </div>
                <div className="mb-4 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-lg font-happy-monkey text-gray-800 text-center mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center text-sm">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white font-happy-monkey rounded-full px-6 py-3 inline-flex items-center gap-2 hover:shadow-lg transition"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-happy-monkey text-center text-[#208EB1] mb-10">
            What Our Members Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#F9FCFD] rounded-xl p-6 shadow-sm hover:shadow-md transition hover:translate-y-[-2px] animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-happy-monkey text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-[rgba(6,196,213,0.05)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-happy-monkey text-center text-[#208EB1] mb-8">
            Benefits of Caktus Coco
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Establish daily wellness habits",
              "Track your progress with clear metrics",
              "Connect with licensed professionals",
              "Access evidence-based practices",
              "Build a personalized routine",
              "Join a supportive community"
            ].map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:translate-x-1 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-[#E8F7FA] p-2 rounded-full">
                  <Check className="w-4 h-4 text-[#06C4D5]" />
                </div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#06C4D5] to-[#208EB1] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-happy-monkey mb-4 animate-fade-in">
            Ready to Start Your Caktus Coco Journey?
          </h2>
          
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 animate-fade-in" style={{ animationDelay: '300ms' }}>
            Join thousands of others improving their mental wellness with personalized practices and expert guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '500ms' }}>
            <Link 
              to="/register" 
              className="bg-white text-[#208EB1] font-happy-monkey rounded-full px-8 py-3 shadow hover:shadow-lg transition"
            >
              Create Your Account
            </Link>
            
            <Link 
              to="/login" 
              className="border border-white text-white rounded-full px-8 py-3 hover:bg-white/10 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-happy-monkey text-[#06C4D5] lowercase">Caktus Coco</span>
            <p className="text-sm text-gray-500 mt-1">©2023 All rights reserved</p>
          </div>
          
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-[#208EB1] transition">About</a>
            <a href="#" className="hover:text-[#208EB1] transition">Privacy</a>
            <a href="#" className="hover:text-[#208EB1] transition">Terms</a>
            <a href="#" className="hover:text-[#208EB1] transition">Contact</a>
          </div>
        </div>
      </footer>

      {/* Add CSS animation classes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.7s ease-in-out forwards;
        }
        
        .animate-fade-in-slow {
          animation: fadeIn 0.7s ease-in-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-slower {
          animation: fadeIn 0.7s ease-in-out 0.5s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-slowest {
          animation: fadeIn 0.7s ease-in-out 0.7s forwards;
          opacity: 0;
        }
        
        .animate-slide-in {
          animation: slideIn 0.7s ease-in-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.7s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
