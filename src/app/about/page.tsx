import Image from "next/image";
import Link from "next/link";
import HeaderNavigation from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { Users, Globe, Award, TrendingUp, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "148M+", label: "Registered Accounts" },
    { number: "160+", label: "Countries Served" },
    { number: "12", label: "Years of Excellence" },
    { number: "$1.5B+", label: "Daily Trading Volume" },
  ];

  const values = [
    {
      icon: <Users size={48} className="text-primary" />,
      title: "User-First Approach",
      description: "Every feature we build is designed with traders in mind. Your success is our success.",
    },
    {
      icon: <Shield size={48} className="text-primary" />,
      title: "Security & Trust",
      description: "Bank-level encryption and regulatory compliance to keep your funds and data safe.",
    },
    {
      icon: <Zap size={48} className="text-primary" />,
      title: "Innovation",
      description: "Cutting-edge technology and constant innovation to stay ahead of the market.",
    },
    {
      icon: <Globe size={48} className="text-primary" />,
      title: "Global Reach",
      description: "Supporting traders worldwide with localized experiences and 24/7 support.",
    },
  ];

  const awards = [
    {
      year: "2024",
      title: "Best Trading Platform",
      organization: "World Forex Award",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award3-18.svg",
    },
    {
      year: "2024",
      title: "Best Mobile Trading App",
      organization: "World Forex Award",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award4-19.svg",
    },
    {
      year: "2023",
      title: "Best Trading Experience",
      organization: "FX Daily Info",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award1-16.svg",
    },
    {
      year: "2022",
      title: "Most Innovative Trading Platform",
      organization: "World Business Outlook",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/award2-17.svg",
    },
  ];

  const timeline = [
    { year: "2013", event: "IQ Option founded with vision to democratize trading" },
    { year: "2014", event: "Launched first mobile trading app" },
    { year: "2016", event: "Reached 10M registered traders" },
    { year: "2018", event: "Introduced advanced charting tools and indicators" },
    { year: "2020", event: "50M traders milestone achieved" },
    { year: "2022", event: "Partnership with McLaren Racing announced" },
    { year: "2023", event: "Launched Loyalty Program for traders" },
    { year: "2024", event: "100M traders milestone, expanded to 160 countries" },
  ];

  return (
    <div className="min-h-screen bg-background-deep">
      <HeaderNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-display-1 text-white mb-6">
              About <span className="text-primary">IQ Option</span>
            </h1>
            <p className="text-title-2 text-text-secondary max-w-3xl mx-auto">
              12 years of innovation, excellence, and empowering traders worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-display-2 text-primary font-bold mb-2">{stat.number}</div>
                <div className="text-body-1 text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 bg-background-mid/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-display-3 text-white mb-6">Our Story</h2>
              <p className="text-body-1 text-text-secondary mb-6">
                Founded in 2013, IQ Option started with a simple mission: make trading accessible to everyone. What began as a small team with a big vision has grown into one of the world's leading trading platforms.
              </p>
              <p className="text-body-1 text-text-secondary mb-6">
                Today, we serve over 148 million traders across 160 countries, processing over $1.5 billion in daily trading volume. Our success is built on continuous innovation, unwavering commitment to security, and dedication to our users' success.
              </p>
              <p className="text-body-1 text-text-secondary">
                From our partnership with McLaren Racing to our industry-leading mobile apps, we continue to push boundaries and set new standards in online trading.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/mclaren_1x-15.png"
                alt="McLaren Partnership"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-display-3 text-white text-center mb-4">Our Values</h2>
          <p className="text-body-1 text-text-secondary text-center max-w-3xl mx-auto mb-16">
            The principles that guide everything we do
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-background-mid border border-border-subtle rounded-2xl p-8 text-center hover:border-primary transition-colors"
              >
                <div className="flex justify-center mb-6">{value.icon}</div>
                <h3 className="text-title-4 text-white mb-3">{value.title}</h3>
                <p className="text-body-2 text-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-background-mid/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-display-3 text-white text-center mb-16">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border-medium -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col md:flex-row`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center md:text-left`}>
                    <div className="text-primary text-2xl font-bold mb-2">{item.year}</div>
                    <p className="text-white text-lg">{item.event}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background-deep relative z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-display-3 text-white text-center mb-4">Awards & Recognition</h2>
          <p className="text-body-1 text-text-secondary text-center max-w-3xl mx-auto mb-16">
            Industry recognition for excellence in trading technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-background-mid border border-border-subtle rounded-2xl p-8 text-center hover:border-primary transition-colors"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <Image src={award.image} alt={award.title} fill className="object-contain" />
                </div>
                <div className="text-primary font-bold mb-2">{award.year}</div>
                <h3 className="text-white font-semibold mb-2 text-lg">{award.title}</h3>
                <p className="text-text-secondary text-sm uppercase tracking-wide">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-background-mid/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-display-3 text-white mb-6">Join Our Trading Community</h2>
          <p className="text-body-1 text-text-secondary mb-8">
            Be part of a platform trusted by millions of traders worldwide
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-primary hover:bg-orange-hover text-white font-semibold rounded-lg transition-colors"
          >
            Start Trading Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
