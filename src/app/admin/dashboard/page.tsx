"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LogOut, 
  Home, 
  Award,
  TrendingUp,
  DollarSign,
  CreditCard,
  RefreshCw,
  Edit,
  Clock,
  Trophy,
  Video,
  Calendar,
  Zap,
  Gift,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentSection {
  id: number;
  sectionKey: string;
  contentData: any;
  updatedAt: string | Date;
  updatedBy: string | null;
}

const SECTION_CONFIG: Record<string, { name: string; description: string; icon: any }> = {
  hero: {
    name: 'Hero Section',
    description: 'Main headline, subheadline, and trader statistics',
    icon: Home
  },
  awards: {
    name: 'Awards Section',
    description: 'Trading platform awards and achievements',
    icon: Award
  },
  ticker: {
    name: 'Ticker Banner',
    description: 'Live market data ticker with price changes',
    icon: TrendingUp
  },
  mclaren: {
    name: 'McLaren Partnership',
    description: 'McLaren partnership section with CEO quote',
    icon: Trophy
  },
  video_hero: {
    name: 'Video Hero Section',
    description: 'Video section with headline and CTA',
    icon: Video
  },
  timeline: {
    name: 'Timeline Section',
    description: 'Company milestones and history timeline',
    icon: Calendar
  },
  tech_features: {
    name: 'Tech Features Section',
    description: 'Trading platform features and tools showcase',
    icon: Zap
  },
  demo_account: {
    name: 'Demo Account Section',
    description: 'Virtual trading account information and features',
    icon: DollarSign
  },
  bonuses: {
    name: 'Bonuses Section',
    description: 'Special bonuses, VIP benefits, and tournaments',
    icon: Gift
  },
  deposits: {
    name: 'Deposits Section',
    description: 'Deposit and withdrawal information by country',
    icon: CreditCard
  },
  testimonials: {
    name: 'Testimonials Section',
    description: 'User reviews and testimonials',
    icon: MessageSquare
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    const username = localStorage.getItem('admin_username');
    
    if (!token) {
      toast.error('Please login to access the admin panel');
      router.push('/admin/login');
      return;
    }

    setAdminUsername(username || 'Admin');
    fetchSections(token);
  }, [router]);

  const fetchSections = async (token: string) => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        router.push('/admin/login');
      } else {
        toast.error('Failed to load sections');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load sections');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');
    
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const handleRefresh = () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetchSections(token);
      toast.success('Sections refreshed');
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-deep flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-deep">
      {/* Header */}
      <header className="bg-card border-b border-border-subtle sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/favicon-47.svg"
                  alt="IQ Option Logo"
                  width={32}
                  height={32}
                />
                <span className="font-sans text-xl font-semibold text-white">iq option</span>
              </Link>
              <span className="text-text-tertiary">|</span>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-text-secondary">
                  Welcome back, <span className="text-primary">{adminUsername}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-white transition-colors disabled:opacity-50"
                title="Refresh sections"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-white transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-white transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border-subtle rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Total Sections</p>
                <p className="text-3xl font-bold text-white">{sections.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border-subtle rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Editable Sections</p>
                <p className="text-3xl font-bold text-white">{Object.keys(SECTION_CONFIG).length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success-green/10 flex items-center justify-center">
                <Edit className="w-6 h-6 text-success-green" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border-subtle rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Last Updated</p>
                <p className="text-lg font-semibold text-white">
                  {sections.length > 0 ? formatDate(sections[0].updatedAt).split(',')[0] : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="bg-card border border-border-subtle rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border-subtle">
            <h2 className="text-xl font-bold text-white">Homepage Content Sections</h2>
            <p className="text-text-secondary text-sm mt-1">
              Manage all content displayed on your homepage
            </p>
          </div>

          <div className="divide-y divide-border-subtle">
            {Object.entries(SECTION_CONFIG).map(([key, config]) => {
              const section = sections.find(s => s.sectionKey === key);
              const Icon = config.icon;

              return (
                <div
                  key={key}
                  className="p-6 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {config.name}
                        </h3>
                        <p className="text-sm text-text-secondary mb-2">
                          {config.description}
                        </p>
                        {section && (
                          <div className="flex items-center gap-3 text-xs text-text-tertiary">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated: {formatDate(section.updatedAt)}
                            </span>
                            {section.updatedBy && (
                              <span>
                                by {section.updatedBy}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/admin/edit/${key}`}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-orange-hover text-white transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Content
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">📝 Quick Guide</h3>
          <ul className="text-text-secondary text-sm space-y-2">
            <li>• Click "Edit Content" on any section to modify its content</li>
            <li>• Changes are saved to the database and will reflect on the homepage immediately</li>
            <li>• Use the "View Site" button to preview your changes</li>
            <li>• All changes are tracked with timestamps for your reference</li>
          </ul>
        </div>
      </main>
    </div>
  );
}