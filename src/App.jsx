import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Users, Shield, Star, ArrowRight, Play, MessageCircle, TrendingUp } from 'lucide-react';
import './App.css';

// Import assets
import kaziniLogo from './assets/kazinilogo.png';
import kaziniIcon from './assets/kazini-appicon.png';

// Components
import TruthTest from './components/TruthTest';
import CoupleMode from './components/CoupleMode';
import TrustIndex from './components/TrustIndex';
import History from './components/History';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Truth Detection",
      description: "AI-powered analysis of emotional authenticity in conversations",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Couple Modes",
      description: "Live room codes and async link sharing for partners",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trust Index",
      description: "Visual scoring and confidence tracking over time",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Secure, encrypted conversations with optional sharing",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Mike",
      text: "Kazini helped us communicate more honestly in our relationship.",
      rating: 5
    },
    {
      name: "Alex Chen",
      text: "The AI insights are surprisingly accurate and helpful.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      text: "A game-changer for understanding emotional authenticity.",
      rating: 5
    }
  ];

  const renderView = () => {
    switch (currentView) {
      case 'truth-test':
        return <TruthTest onBack={() => setCurrentView('home')} />;
      case 'couple-mode':
        return <CoupleMode onBack={() => setCurrentView('home')} />;
      case 'trust-index':
        return <TrustIndex onBack={() => setCurrentView('home')} />;
      case 'history':
        return <History onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="min-h-screen">
            {/* Hero Section */}
            <section className="kazini-hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-10">
                <div className="floating-animation absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                <div className="floating-animation absolute top-40 right-32 w-24 h-24 bg-white rounded-full" style={{ animationDelay: '2s' }}></div>
                <div className="floating-animation absolute bottom-32 left-1/4 w-40 h-40 bg-white rounded-full" style={{ animationDelay: '4s' }}></div>
              </div>

              <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
                  transition={{ duration: 0.8 }}
                  className="mb-8"
                >
                  <img 
                    src={kaziniLogo} 
                    alt="Kazini Logo" 
                    className="w-64 h-auto mx-auto mb-6 floating-animation"
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6"
                >
                  Discover Emotional
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Truth
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  AI-powered emotional truth detection for deeper, more authentic relationships. 
                  Understand the real emotions behind every conversation.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                  <button
                    onClick={() => setCurrentView('truth-test')}
                    className="bg-white text-[#3B2A4A] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 pulse-glow"
                  >
                    <Play className="w-6 h-6" />
                    Start Truth Test
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('couple-mode')}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#3B2A4A] transition-all duration-300 flex items-center gap-3"
                  >
                    <Users className="w-6 h-6" />
                    Couple Mode
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-16 text-white/70"
                >
                  <p className="text-sm mb-4">Powered by AI • Trusted by thousands</p>
                  <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm">4.9/5 from 10,000+ users</span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Why Choose Kazini?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Advanced AI technology meets intuitive design to help you understand 
                    emotional authenticity like never before.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    How It Works
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Simple, powerful, and accurate emotional truth detection in three steps.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                  {[
                    {
                      step: "1",
                      title: "Ask a Question",
                      description: "Type or speak your question to start the emotional analysis process.",
                      icon: <MessageCircle className="w-12 h-12" />
                    },
                    {
                      step: "2",
                      title: "Get Response",
                      description: "Receive an answer and let our AI analyze the emotional authenticity.",
                      icon: <Zap className="w-12 h-12" />
                    },
                    {
                      step: "3",
                      title: "View Results",
                      description: "See truth indicators, confidence scores, and detailed insights.",
                      icon: <TrendingUp className="w-12 h-12" />
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 bg-gradient-to-r from-[#3B2A4A] to-[#FF5A5F] rounded-full flex items-center justify-center text-white mx-auto mb-6">
                        {step.icon}
                      </div>
                      <div className="text-sm font-bold text-[#FF5A5F] mb-2">STEP {step.step}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    What Users Say
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Join thousands of users who have discovered deeper emotional connections.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white p-8 rounded-2xl shadow-lg"
                    >
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 kazini-hero-bg">
              <div className="container mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Discover Truth?
                  </h2>
                  <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                    Start your journey to deeper, more authentic relationships today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                      onClick={() => setCurrentView('truth-test')}
                      className="bg-white text-[#3B2A4A] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 pulse-glow"
                    >
                      <Play className="w-6 h-6" />
                      Start Free Trial
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#3B2A4A] text-white py-12">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center gap-4 mb-6 md:mb-0">
                    <img src={kaziniIcon} alt="Kazini" className="w-12 h-12" />
                    <div>
                      <div className="text-xl font-bold">Kazini</div>
                      <div className="text-sm text-white/70">Powered by Visnec Global</div>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <button
                      onClick={() => setCurrentView('trust-index')}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Trust Index
                    </button>
                    <button
                      onClick={() => setCurrentView('history')}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      History
                    </button>
                  </div>
                </div>
                <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
                  <p>&copy; 2024 Visnec Global. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
    </div>
  );
}

export default App;

