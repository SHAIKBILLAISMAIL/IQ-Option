"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Search } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.8 10.22C19.8 9.54 19.74 8.89 19.62 8.26H10.5V11.9H15.89C15.67 13.06 15.06 14.05 14.18 14.67V17.15H17.39C18.99 15.69 19.8 13.18 19.8 10.22Z" fill="#4285F4"/>
    <path d="M10.5 20C13.2 20 15.51 19.12 17.39 17.15L14.18 14.67C13.29 15.26 12.01 15.63 10.5 15.63C7.88 15.63 5.66 13.9 4.8 11.53H1.46V14.09C3.21 17.61 6.58 20 10.5 20Z" fill="#34A853"/>
    <path d="M4.8 11.53C4.62 10.97 4.5 10.37 4.5 9.75C4.5 9.13 4.62 8.53 4.8 7.97V5.41H1.46C0.85 6.63 0.5 8.14 0.5 9.75C0.5 11.36 0.85 12.87 1.46 14.09L4.8 11.53Z" fill="#FBBC05"/>
    <path d="M10.5 3.87C12.07 3.87 13.42 4.41 14.48 5.4L17.5 2.38C15.51 0.91 13.2 0 10.5 0C6.58 0 3.21 2.39 1.46 5.41L4.8 7.97C5.66 5.6 7.88 3.87 10.5 3.87Z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.5 20C16.0228 20 20.5 15.5228 20.5 10C20.5 4.47715 16.0228 0 10.5 0C4.97715 0 0.5 4.47715 0.5 10C0.5 14.991 4.15685 19.049 8.9375 19.839V12.875H6.3975V9.982H8.9375V7.907C8.9375 5.391 10.3955 4 12.6325 4C13.7265 4 14.6525 4.083 14.9375 4.12V6.638H13.6555C12.4175 6.638 12.0625 7.373 12.0625 8.194V9.982H14.8345L14.4025 12.875H12.0625V19.839C16.8431 19.049 20.5 14.991 20.5 10Z" />
    </svg>
);

const Checkbox = ({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) => (
    <>
      <input id={id} type="checkbox" className="hidden peer" {...props} />
      <label
        htmlFor={id}
        className="flex-shrink-0 w-5 h-5 border-2 border-border-medium rounded-md cursor-pointer flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-colors"
      >
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/check-mark-28.svg"
          alt="check mark"
          width={12}
          height={12}
          className="hidden peer-checked:block"
        />
      </label>
    </>
  );

const countries = [
  { name: 'Albania', code: 'al' }, { name: 'Algeria', code: 'dz' }, { name: 'Andorra', code: 'ad' }, { name: 'Angola', code: 'ao' }, { name: 'Antigua and Barbuda', code: 'ag' }, { name: 'Argentina', code: 'ar' }, { name: 'Armenia', code: 'am' }, { name: 'Azerbaijan', code: 'az' }, { name: 'Bahamas', code: 'bs' }, { name: 'Bahrain', code: 'bh' }, { name: 'Bangladesh', code: 'bd' }, { name: 'Barbados', code: 'bb' }, { name: 'Belize', code: 'bz' }, { name: 'Benin', code: 'bj' }, { name: 'Bhutan', code: 'bt' }, { name: 'Bolivia', code: 'bo' }, { name: 'Bosnia and Herzegowina', code: 'ba' }, { name: 'Botswana', code: 'bw' }, { name: 'Brazil', code: 'br' }, { name: 'Brunei Darussalam', code: 'bn' }, { name: 'Burkina Faso', code: 'bf' }, { name: 'Burundi', code: 'bi' }, { name: 'Cambodia', code: 'kh' }, { name: 'Cameroon', code: 'cm' }, { name: 'Cape Verde', code: 'cv' }, { name: 'Chile', code: 'cl' }, { name: 'China', code: 'cn' }, { name: 'Colombia', code: 'co' }, { name: 'Costa Rica', code: 'cr' }, { name: "Côte d'Ivoire", code: 'ci' }, { name: 'Ecuador', code: 'ec' }, { name: 'Egypt', code: 'eg' }, { name: 'El Salvador', code: 'sv' }, { name: 'Georgia', code: 'ge' }, { name: 'Ghana', code: 'gh' }
];

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[18]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = searchTerm
    ? countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : countries;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-body-3 text-text-secondary mb-2">Country of residence</label>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-input border border-border-medium rounded-sm h-[56px] px-4 text-left focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-6 h-4 bg-border-medium rounded-sm flex-shrink-0"></div>
          <span className="text-body-2 text-text-primary">{selectedCountry.name}</span>
        </div>
        <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/select-arrow-26.svg" alt="select arrow" width={20} height={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border-medium rounded-lg z-10 max-h-[300px] flex flex-col animate-in fade-in-0 duration-200">
          <div className="p-2 border-b border-border-subtle">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18}/>
              <input
                type="text"
                placeholder="Search"
                autoFocus
                className="w-full bg-input border border-border-medium rounded-md h-10 pl-9 pr-4 text-body-2 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-0 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto p-2">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div key={country.code} onClick={() => { setSelectedCountry(country); setIsOpen(false); setSearchTerm(''); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-md cursor-pointer group">
                  <div className="w-6 h-4 bg-border-medium rounded-sm flex-shrink-0"></div>
                  <span className="text-body-2 text-text-secondary group-hover:text-text-primary">{country.name}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-text-secondary text-body-3">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InitialStep = ({ setStep }: { setStep: (step: string) => void }) => (
    <div className="flex flex-col gap-4 animate-in fade-in-0 duration-300">
      <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center gap-4 w-full h-[52px] bg-secondary text-text-primary border border-border-medium rounded-sm text-button-md hover:border-primary hover:text-primary transition-colors">
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-4 w-full h-[52px] bg-secondary text-text-primary border border-border-medium rounded-sm text-button-md hover:border-primary hover:text-primary transition-colors">
            <FacebookIcon />
            <span>Facebook</span>
          </button>
      </div>

      <div className="flex items-center gap-4 my-2">
         <div className="h-px flex-1 bg-border-subtle"></div>
         <span className="text-text-tertiary text-sm font-medium">or</span>
         <div className="h-px flex-1 bg-border-subtle"></div>
      </div>
      
      <button onClick={() => setStep('email')} className="w-full h-[52px] bg-primary text-primary-foreground rounded-sm text-button-md font-semibold hover:bg-orange-hover transition-colors">
        Proceed with email
      </button>

      <p className="text-center text-body-3 text-text-secondary mt-4">
        Already have an account?{' '}
        <button className="text-primary hover:text-orange-hover font-semibold">
          Log in
        </button>
      </p>
    </div>
);

const EmailStep = () => (
    <form className="flex flex-col gap-6 animate-in fade-in-0 duration-300" onSubmit={(e) => e.preventDefault()}>
      <CountrySelector />
      
      <div>
        <label htmlFor="email" className="block text-body-3 text-text-secondary mb-2">Email</label>
        <input type="email" id="email" placeholder="Email" className="w-full bg-input border border-border-medium rounded-sm h-[56px] px-4 text-body-2 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
      </div>

       <div>
        <label htmlFor="password" className="block text-body-3 text-text-secondary mb-2">Password</label>
        <input type="password" id="password" placeholder="Create a password" className="w-full bg-input border border-border-medium rounded-sm h-[56px] px-4 text-body-2 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors" />
      </div>

      <div className="flex items-start gap-3">
         <Checkbox id="agreement" />
         <label htmlFor="agreement" className="text-caption text-text-secondary">
           I confirm that I am 18 years old or older, and I have read and accepted the <a href="#" className="text-primary hover:text-orange-hover">Terms &amp; Conditions</a> and <a href="#" className="text-primary hover:text-orange-hover">Privacy Policy</a>.
         </label>
      </div>

      <button type="submit" className="w-full h-[52px] bg-primary text-primary-foreground rounded-sm text-button-md font-semibold hover:bg-orange-hover transition-colors mt-2">
        Complete registration
      </button>
    </form>
);


interface RegistrationModalProps {
  onClose: () => void;
}

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [step, setStep] = useState('initial');
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-in fade-in-0 duration-300" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-background-mid rounded-lg max-w-[480px] w-full p-8 relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-text-tertiary hover:text-text-primary transition-colors z-10 p-2" aria-label="Close modal">
          <X size={20} />
        </button>

        <h2 className="text-display-4 text-center text-text-primary mb-8">
          Create an account
        </h2>
        
        {step === 'initial' && <InitialStep setStep={setStep} />}
        {step === 'email' && <EmailStep />}
      </div>
    </div>
  );
}