import Image from "next/image";
import Link from "next/link";
import HeaderNavigation from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { TrendingUp, BarChart3, BookOpen, Video, Users, Award } from "lucide-react";

export default function ForTradersPage() {
  const features = [
    {
      icon: <BarChart3 size={40} className="text-primary" />,
      title: "Advanced Analytics",
      description: "Access professional-grade charting tools, technical indicators, and real-time market data to make informed trading decisions.",
    },
    {
      icon: <Video size={40} className="text-primary" />,
      title: "Educational Webinars",
      description: "Join live webinars hosted by expert traders. Learn strategies, market analysis, and risk management techniques.",
    },
    {
      icon: <BookOpen size={40} className="text-primary" />,
      title: "Trading Academy",
      description: "Comprehensive video tutorials, guides, and courses for beginners to advanced traders. Learn at your own pace.",
    },
    {
      icon: <Users size={40} className="text-primary" />,
      title: "Community & Chat",
      description: "Connect with traders worldwide in themed chat rooms. Share insights, strategies, and market analysis.",
    },
    {
      icon: <Award size={40} className="text-primary" />,
      title: "Trading Tournaments",
      description: "Compete in regular tournaments with prize pools up to $250,000. No entry fees, just your trading skills.",
    },
    {
      icon: <TrendingUp size={40} className="text-primary" />,
      title: "Live Strategies",
      description: "Follow and copy successful trading strategies from top performers on the platform in real-time.",
    },
  ];

  const tools = [
    {
      title: "Script Indicators",
      description: "Create custom indicators using JavaScript. Access a library of community-built scripts.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/chart-indicators-29.svg",
    },
    {
      title: "Multi-Chart Layout",
      description: "Monitor multiple assets simultaneously with customizable chart layouts and workspaces.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/chart-29.svg",
    },
    {
      title: "Risk Management",
      description: "Set stop-loss, take-profit, and trailing stop orders to protect your capital and lock in profits.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_7.png",
    },
  ];

  const benefits = [
    "24/7 Customer Support",
    "Instant Deposits & Withdrawals",
    "Mobile & Desktop Apps",
    "Demo Account with $10,000",
    "VIP Account Benefits",
    "Loyalty Rewards Program",
  ];

  return (
    <div className="min-h-screen bg-background-deep">
      <HeaderNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-display-2 text-white mb-6">
              Everything You Need to <span className="text-primary">Trade Successfully</span>
            </h1>
            <p className="text-body-1 text-text-secondary max-w-3xl mx-auto mb-8">
              Access professional trading tools, educational resources, and a supportive community. Whether you're starting out or scaling up, we have what you need.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary hover:bg-orange-hover text-white font-semibold rounded-lg transition-colors"
              >
                Start Trading Now
              </Link>
              <Link
                href="/trade"
                className="px-8 py-4 bg-transparent border border-border-medium hover:border-primary text-white font-semibold rounded-lg transition-colors"
              >
                Try Demo Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-display-3 text-white text-center mb-16">Trading Features & Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background-mid border border-border-subtle rounded-2xl p-8 hover:border-primary transition-colors group"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-title-3 text-white mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-body-2 text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Tools */}
      <section className="py-20 px-6 bg-background-mid/50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-display-3 text-white text-center mb-4">Professional Trading Tools</h2>
          <p className="text-body-1 text-text-secondary text-center max-w-3xl mx-auto mb-16">
            Advanced features designed for serious traders who demand the best technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-background-mid border border-border-subtle rounded-2xl overflow-hidden hover:border-primary transition-colors"
              >
                <div className="relative h-48 bg-background-deep">
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    fill
                    className="object-contain p-6"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-title-4 text-white mb-2">{tool.title}</h3>
                  <p className="text-body-2 text-text-secondary">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/30 rounded-3xl p-12">
            <h2 className="text-display-3 text-white text-center mb-4">Why Trade with IQ Option?</h2>
            <p className="text-body-1 text-text-secondary text-center mb-12">
              Join 148M traders who trust our platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Image
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/check-8.svg"
                      alt="check"
                      width={16}
                      height={16}
                    />
                  </div>
                  <span className="text-white font-semibold">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-primary hover:bg-orange-hover text-white font-semibold rounded-lg transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-background-mid/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-display-3 text-white mb-6">Ready to Start Trading?</h2>
          <p className="text-body-1 text-text-secondary mb-8">
            Open a free account in minutes. No credit card required for demo trading.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary hover:bg-orange-hover text-white font-semibold rounded-lg transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/download"
              className="px-8 py-4 bg-transparent border border-border-medium hover:border-primary text-white font-semibold rounded-lg transition-colors"
            >
              Download App
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
