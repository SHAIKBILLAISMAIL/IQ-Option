import HeaderNavigation from '@/components/sections/header-navigation';
import Footer from '@/components/sections/footer';
import { Download, Smartphone, Monitor, Apple, Play, Chrome } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background-deep">
      <HeaderNavigation />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-display-2 text-text-primary mb-6">
              Download IQ Option
            </h1>
            <p className="text-body-1 text-text-secondary mb-8">
              Trade on the go with our award-winning mobile and desktop applications. 
              Available for all major platforms.
            </p>
            <div className="flex items-center justify-center gap-4 text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-body-2">Free to download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-body-2">148M+ downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-body-2">4.4★ rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* PWA Install Section - NEW */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/40 rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shrink-0">
                  <Chrome className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-display-4 text-text-primary mb-2">Install Web App (Recommended)</h2>
                  <p className="text-body-1 text-text-secondary">
                    Install IQ Option directly from your browser - no app store needed!
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                {/* Mobile Installation */}
                <div className="bg-background-mid/50 backdrop-blur-sm rounded-2xl p-6 border border-border-subtle">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                    <h3 className="text-title-3 text-text-primary">On Mobile</h3>
                  </div>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-body-3 font-semibold">1</span>
                      <div>
                        <p className="text-body-2 text-text-primary font-semibold">Visit this website</p>
                        <p className="text-body-3 text-text-secondary">Open this page in your mobile browser (Chrome, Safari, etc.)</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-body-3 font-semibold">2</span>
                      <div>
                        <p className="text-body-2 text-text-primary font-semibold">Look for install prompt</p>
                        <p className="text-body-3 text-text-secondary">A popup will appear asking to install the app</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-body-3 font-semibold">3</span>
                      <div>
                        <p className="text-body-2 text-text-primary font-semibold">Tap "Install" or "Add to Home Screen"</p>
                        <p className="text-body-3 text-text-secondary">The app icon will be added to your home screen</p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <p className="text-body-3 text-text-secondary">
                      <span className="font-semibold text-text-primary">iOS Users:</span> Tap the Share button <span className="inline-block">⎙</span> in Safari, then scroll and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>

                {/* Desktop Installation */}
                <div className="bg-background-mid/50 backdrop-blur-sm rounded-2xl p-6 border border-border-subtle">
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-6 h-6 text-primary" />
                    <h3 className="text-title-3 text-text-primary">On Desktop</h3>
                  </div>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-body-3 font-semibold">1</span>
                      <div>
                        <p className="text-body-2 text-text-primary font-semibold">Look at the address bar</p>
                        <p className="text-body-3 text-text-secondary">You'll see an install icon <span className="inline-block">⊕</span> or download icon</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-body-3 font-semibold">2</span>
                      <div>
                        <p className="text-body-2 text-text-primary font-semibold">Click the install button</p>
                        <p className="text-body-3 text-text-secondary">Or use the menu: More Tools → Install IQ Option</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-body-3 font-semibold">3</span>
                      <div>
                        <p className="text-body-2 text-text-primary font-semibold">Confirm installation</p>
                        <p className="text-body-3 text-text-secondary">The app will open in its own window like a native app</p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-success-green/10 rounded-lg border border-success-green/30">
                    <p className="text-body-3 text-text-secondary">
                      <span className="font-semibold text-text-primary">✨ Benefits:</span> Faster loading, offline support, desktop shortcuts, and native app experience!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Apps Section */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Smartphone className="w-8 h-8 text-primary" />
              <h2 className="text-display-3 text-text-primary">Mobile Apps (Alternative)</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* iOS App */}
              <div className="bg-background-mid border border-border-subtle rounded-2xl p-8 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Apple className="w-10 h-10 text-text-primary" />
                      <h3 className="text-title-2 text-text-primary">iOS App</h3>
                    </div>
                    <p className="text-body-2 text-text-secondary">For iPhone and iPad</p>
                  </div>
                  <div className="bg-card px-3 py-1 rounded-full">
                    <span className="text-caption text-primary font-semibold">FREE</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-body-2 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    iOS 13.0 or later
                  </li>
                  <li className="flex items-center gap-2 text-body-2 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Compatible with iPhone, iPad, and iPod touch
                  </li>
                  <li className="flex items-center gap-2 text-body-2 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Size: ~120 MB
                  </li>
                </ul>

                <a 
                  href="https://apps.apple.com/app/iq-option" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-orange-hover text-white font-semibold py-4 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download on App Store
                </a>
              </div>

              {/* Android App */}
              <div className="bg-background-mid border border-border-subtle rounded-2xl p-8 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Play className="w-10 h-10 text-text-primary" />
                      <h3 className="text-title-2 text-text-primary">Android App</h3>
                    </div>
                    <p className="text-body-2 text-text-secondary">For Android devices</p>
                  </div>
                  <div className="bg-card px-3 py-1 rounded-full">
                    <span className="text-caption text-primary font-semibold">FREE</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-body-2 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Android 5.0 or later
                  </li>
                  <li className="flex items-center gap-2 text-body-2 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Compatible with phones and tablets
                  </li>
                  <li className="flex items-center gap-2 text-body-2 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Size: ~95 MB
                  </li>
                </ul>

                <a 
                  href="https://play.google.com/store/apps/details?id=com.iqoption" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-orange-hover text-white font-semibold py-4 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Get it on Google Play
                </a>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-12 bg-card border border-border-subtle rounded-2xl p-8 text-center">
              <h3 className="text-title-3 text-text-primary mb-4">Scan to Download</h3>
              <p className="text-body-2 text-text-secondary mb-6">Scan the QR code with your mobile device to download the app</p>
              <div className="inline-block p-4 bg-white rounded-xl">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_25.png" 
                  alt="QR Code" 
                  className="w-32 h-32"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Apps Section */}
        <section className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Monitor className="w-8 h-8 text-primary" />
              <h2 className="text-display-3 text-text-primary">Desktop Apps</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Windows App */}
              <div className="bg-background-mid border border-border-subtle rounded-2xl p-8 hover:border-primary transition-colors">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                    </svg>
                  </div>
                  <h3 className="text-title-3 text-text-primary mb-2">Windows</h3>
                  <p className="text-body-3 text-text-secondary mb-4">Windows 7 or later</p>
                  <p className="text-caption text-text-tertiary">Size: ~180 MB</p>
                </div>
                
                <button className="w-full bg-primary hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download .exe
                </button>
              </div>

              {/* macOS App */}
              <div className="bg-background-mid border border-border-subtle rounded-2xl p-8 hover:border-primary transition-colors">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <Apple className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-title-3 text-text-primary mb-2">macOS</h3>
                  <p className="text-body-3 text-text-secondary mb-4">macOS 10.13 or later</p>
                  <p className="text-caption text-text-tertiary">Size: ~200 MB</p>
                </div>
                
                <button className="w-full bg-primary hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download .dmg
                </button>
              </div>

              {/* Linux App */}
              <div className="bg-background-mid border border-border-subtle rounded-2xl p-8 hover:border-primary transition-colors">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.738-.410 2.567 0 .896.152 1.784.410 2.654.775 2.604 2.775 4.604 5.568 5.568.896.258 1.784.410 2.654.410s1.758-.152 2.654-.410c2.793-.964 4.793-2.964 5.568-5.568.258-.87.410-1.758.410-2.654 0-.829-.132-1.727-.410-2.567-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm-.005 2.024c.075 0 .15.003.224.009 1.322.104 2.021.767 2.146 2.037.125 1.278-.208 2.467-.832 3.645-.624 1.178-1.456 2.277-1.456 3.645 0 1.368.832 2.467 1.456 3.645.624 1.178.957 2.367.832 3.645-.125 1.27-.824 1.933-2.146 2.037-.074.006-.149.009-.224.009s-.15-.003-.224-.009c-1.322-.104-2.021-.767-2.146-2.037-.125-1.278.208-2.467.832-3.645.624-1.178 1.456-2.277 1.456-3.645 0-1.368-.832-2.467-1.456-3.645-.624-1.178-.957-2.367-.832-3.645.125-1.27.824-1.933 2.146-2.037.074-.006.149-.009.224-.009z"/>
                    </svg>
                  </div>
                  <h3 className="text-title-3 text-text-primary mb-2">Linux</h3>
                  <p className="text-body-3 text-text-secondary mb-4">Ubuntu 18.04 or later</p>
                  <p className="text-caption text-text-tertiary">Size: ~175 MB</p>
                </div>
                
                <button className="w-full bg-primary hover:bg-orange-hover text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download .AppImage
                </button>
              </div>
            </div>

            {/* Web Platform */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-orange-hover/10 border border-primary/30 rounded-2xl p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h3 className="text-title-2 text-text-primary mb-2">Trade on the Web</h3>
                  <p className="text-body-2 text-text-secondary">
                    No download required. Start trading instantly in your browser.
                  </p>
                </div>
                <a 
                  href="/"
                  className="bg-primary hover:bg-orange-hover text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Launch Web Platform
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 mt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-display-3 text-text-primary text-center mb-12">
              Why Download IQ Option?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-title-3 text-text-primary mb-2">Lightning Fast</h3>
                <p className="text-body-2 text-text-secondary">
                  Execute trades in milliseconds with our optimized applications
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-title-3 text-text-primary mb-2">Bank-Level Security</h3>
                <p className="text-body-2 text-text-secondary">
                  Your data and funds are protected with military-grade encryption
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-title-3 text-text-primary mb-2">Sync Across Devices</h3>
                <p className="text-body-2 text-text-secondary">
                  Start on mobile, continue on desktop - your account syncs instantly
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}