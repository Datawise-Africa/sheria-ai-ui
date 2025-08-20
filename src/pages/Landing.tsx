import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MessageSquare, 
  BookOpen, 
  Download, 
  Shield, 
  Zap,
  Play,
  ChevronRight,
  Star,
  Check,
  Mail,
  Twitter,
  Linkedin,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">
                SheriaAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/chat">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                  Sign In
                </Button>
              </Link>
              <Link to="/search">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="block text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="block text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <div className="pt-4 space-y-3">
                <Link to="/chat" className="w-full">
                  <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-accent">
                    Sign In
                  </Button>
                </Link>
                <Link to="/search" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Search Kenya Law in{' '}
                  <span className="text-primary">
                    seconds
                  </span>
                  . Ask an AI, cite with confidence.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  SheriaAI lets you search Kenyan cases and query judgments in natural language—fast, accurate, citation-aware.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/search">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4">
                    Start Free Trial
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:bg-accent hover:text-foreground text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Watch 60-sec Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Built on encrypted search</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Cited answers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Kenyan jurisdiction focus</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                    Beta
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                    Student plan available
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Visual - Isometric Stack */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: `
                      linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* Floating Cards Stack */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Card 1 - Case Title */}
                    <div className="absolute -top-8 -left-4 w-48 h-32 bg-card/10 backdrop-blur-xl rounded-lg border border-border/20 shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-105">
                      <div className="p-4">
                        <div className="w-3 h-3 bg-primary rounded-full mb-2"></div>
                        <h3 className="text-sm font-semibold text-foreground">Case Title</h3>
                        <p className="text-xs text-muted-foreground">Republic v. Independent...</p>
                      </div>
                    </div>

                    {/* Card 2 - Citation */}
                    <div className="absolute top-8 -right-4 w-48 h-32 bg-card/10 backdrop-blur-xl rounded-lg border border-border/20 shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-105">
                      <div className="p-4">
                        <div className="w-3 h-3 bg-primary rounded-full mb-2"></div>
                        <h3 className="text-sm font-semibold text-foreground">Citation</h3>
                        <p className="text-xs text-muted-foreground">[2017] eKLR</p>
                      </div>
                    </div>

                    {/* Card 3 - Judge */}
                    <div className="absolute top-24 left-8 w-48 h-32 bg-card/10 backdrop-blur-xl rounded-lg border border-border/20 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105">
                      <div className="p-4">
                        <div className="w-3 h-3 bg-primary rounded-full mb-2"></div>
                        <h3 className="text-sm font-semibold text-foreground">Judge</h3>
                        <p className="text-xs text-muted-foreground">Hon. Justice...</p>
                      </div>
                    </div>

                    {/* Chat Bubble */}
                    <div className="absolute top-40 right-8 w-56 h-32 bg-primary/20 backdrop-blur-xl rounded-2xl border border-primary/30 shadow-2xl">
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm text-foreground">AI analyzing case...</p>
                      </div>
                    </div>

                    {/* Data Stream Lines */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                        <path d="M100 100 Q200 50 300 100" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse">
                          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
                        </path>
                        <path d="M150 150 Q250 100 350 150" stroke="url(#gradient2)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse">
                          <animate attributeName="stroke-dashoffset" values="0;10" dur="2.5s" repeatCount="indefinite" />
                        </path>
                        <defs>
                          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#19F0FF" />
                            <stop offset="100%" stopColor="#7E6BFF" />
                          </linearGradient>
                          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7E6BFF" />
                            <stop offset="100%" stopColor="#19F0FF" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to get accurate, cited legal information from Kenyan cases
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                number: "01",
                title: "Search",
                description: "Type a judge, year, topic, or citation.",
                icon: <Search className="h-8 w-8" />
              },
              {
                number: "02",
                title: "Ask",
                description: "Prompt the chatbot for summaries and context.",
                icon: <MessageSquare className="h-8 w-8" />
              },
              {
                number: "03",
                title: "Cite",
                description: "Get references back to the original judgment.",
                icon: <BookOpen className="h-8 w-8" />
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-card/5 backdrop-blur-xl rounded-2xl p-8 border border-border/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="text-6xl font-bold text-muted-foreground mb-4">{step.number}</div>
                  <div className="text-primary mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Video Placeholder */}
          <div className="text-center">
            <div className="bg-card rounded-2xl p-12 border border-border">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Real data, real citations</h3>
              <p className="text-muted-foreground mb-6">Watch how SheriaAI processes your questions and returns accurate, cited answers from Kenyan case law.</p>
              <Link to="/search">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Try Search Tool
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              What we offer
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools designed specifically for Kenyan legal research and AI-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                title: "Semantic Search for Kenya Law",
                description: "Filter by judge, year, topic, or citation with AI-powered understanding."
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Citation-Aware Chat",
                description: "Get AI summaries that always include proper legal sources and references."
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Saved Workspaces",
                description: "Bookmark cases and research threads for future reference."
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: "Export & Share",
                description: "Copy citations and export notes in multiple formats."
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Compliance & Privacy",
                description: "Your legal queries stay private and secure."
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Fast & Localized",
                description: "Optimized specifically for Kenyan jurisprudence and case law."
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-card/5 backdrop-blur-xl rounded-2xl p-6 border border-border/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              What clients say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted by lawyers, students, and researchers across Kenya
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "Cut my research time in half. The AI understands Kenyan legal context perfectly.",
                  author: "Advocate Sarah Mwangi",
                  role: "Nairobi Law Chambers",
                  rating: 5
                },
                {
                  quote: "Clear citations I can trust. This is exactly what Kenyan law students need.",
                  author: "James Ochieng",
                  role: "Law Student, UoN",
                  rating: 5
                },
                {
                  quote: "The semantic search is incredible. Found relevant cases in seconds.",
                  author: "Prof. Wanjiku Kamau",
                  role: "Legal Researcher, KSL",
                  rating: 5
                },
                {
                  quote: "Export and sharing features make collaboration seamless.",
                  author: "Advocate David Kimani",
                  role: "Corporate Law Firm",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className={`transition-all duration-500 ${
                  index === activeTestimonial ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                }`}>
                  <div className="bg-card/5 backdrop-blur-xl rounded-2xl p-6 border border-border/10 h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-foreground mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include a free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "forever",
                description: "Perfect for students and researchers",
                features: [
                  "100 searches per month",
                  "50 chatbot messages",
                  "5 saved workspaces",
                  "Basic support"
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Professional",
                price: "KSh 2,500",
                period: "per month",
                description: "For practicing lawyers and firms",
                features: [
                  "Unlimited searches",
                  "Unlimited chatbot messages",
                  "Unlimited workspaces",
                  "Priority support",
                  "Export & sharing",
                  "Advanced analytics"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Team",
                price: "KSh 8,000",
                period: "per month",
                description: "For law firms and organizations",
                features: [
                  "Everything in Professional",
                  "Team collaboration",
                  "Admin dashboard",
                  "API access",
                  "Custom integrations",
                  "Dedicated support"
                ],
                cta: "Start Free Trial",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative group ${
                plan.popular ? 'md:-mt-4 md:mb-4' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`bg-card/5 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-primary/50 hover:border-primary/80 shadow-primary/20' 
                    : 'border-border/10 hover:border-primary/30'
                }`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== 'forever' && (
                        <span className="text-muted-foreground text-lg">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-muted hover:bg-muted-foreground text-foreground'
                  }`}>
                    {plan.cta === 'Start Free Trial' ? (
                      <Link to="/search" className="w-full">
                        {plan.cta}
                      </Link>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Student and NGO discounts available. <a href="#contact" className="text-primary hover:text-primary/80 underline">Contact us</a> for details.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Get in touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions? Need a campus or newsroom license? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card/5 backdrop-blur-xl rounded-2xl p-8 border border-border/10">
              <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                    <Input 
                      className="bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                    <Input 
                      type="email"
                      className="bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Organization</label>
                  <Input 
                    className="bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-primary"
                    placeholder="Law firm, university, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                  <Textarea 
                    className="bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-primary min-h-[120px]"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-card/5 backdrop-blur-xl rounded-2xl p-8 border border-border/10">
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:hello@sheriaai.co.ke" className="text-muted-foreground hover:text-foreground transition-colors">hello@sheriaai.co.ke</a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Twitter className="h-5 w-5 text-primary" />
                    <a href="https://twitter.com/SheriaAI_KE" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">@SheriaAI_KE</a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-primary" />
                    <a href="https://linkedin.com/company/sheriaai-kenya" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">SheriaAI Kenya</a>
                  </div>
                </div>
              </div>

              <div className="bg-card/5 backdrop-blur-xl rounded-2xl p-8 border border-border/10">
                <h3 className="text-2xl font-semibold mb-6">Office Location</h3>
                <p className="text-foreground mb-4">
                  Nairobi, Kenya<br />
                  East Africa
                </p>
                <p className="text-sm text-muted-foreground">
                  Serving legal professionals across Kenya and the East African region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">
                  SheriaAI
                </span>
              </Link>
              <p className="text-muted-foreground text-sm">
                AI-powered legal research platform focused on Kenyan case law and jurisprudence.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link to="/search" className="hover:text-foreground transition-colors">Search Tool</Link></li>
                <li><Link to="/chat" className="hover:text-foreground transition-colors">AI Chat</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><Link to="/chat" className="hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#contact" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Plans</a></li>
                <li><a href="mailto:hello@sheriaai.co.ke" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><Link to="/search" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                <p>© 2024 SheriaAI. All rights reserved.</p>
                <p className="mt-1">Focused on Kenyan legal sources and jurisdiction.</p>
              </div>
              <div className="flex items-center space-x-6">
                <a href="https://twitter.com/SheriaAI_KE" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/sheriaai-kenya" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="mailto:hello@sheriaai.co.ke" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
