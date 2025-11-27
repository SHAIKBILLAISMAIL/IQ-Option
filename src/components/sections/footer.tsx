import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: string[];
}) => (
  <div>
    <h4 className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-6">
      {title}
    </h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="text-base text-foreground hover:text-primary transition-colors"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ProgramCard = ({
  iconUrl,
  title,
  href,
}: {
  iconUrl: string;
  title: string;
  href: string;
}) => (
  <a
    href={href}
    className="group relative flex flex-col justify-between p-4 bg-card rounded-xl h-[120px] hover:ring-1 hover:ring-primary/50 transition-all"
  >
    <Image src={iconUrl} alt={`${title} icon`} width={32} height={32} />
    <span className="font-semibold text-sm text-foreground">{title}</span>
    <ArrowUpRight
      className="absolute bottom-4 right-4 text-muted-foreground group-hover:text-primary transition-colors"
      size={20}
    />
  </a>
);

const MessageSparkleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-muted-foreground group-hover:text-primary transition-colors"
  >
    <path
      d="M22 13.3879C22 17.7941 17.5228 21.3879 12 21.3879C11.1965 21.3879 10.421 21.3045 9.68945 21.1472L4 22.3879L5.33777 17.8933C3.01135 15.918 2 13.2562 2 10.3879C2 5.98177 6.47715 2.38794 12 2.38794C17.5228 2.38794 22 5.98177 22 10.3879"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12.9167 6.44751L13.5 5.24751L14.6667 4.64751L13.5 4.04751L12.9167 2.84751L12.3333 4.04751L11.1667 4.64751L12.3333 5.24751L12.9167 6.44751Z"
      fill="currentColor"
    ></path>
    <path
      d="M18.8333 8.36417L19.25 7.46417L20.125 7.01417L19.25 6.56417L18.8333 5.66417L18.4167 6.56417L17.5417 7.01417L18.4167 7.46417L18.8333 8.36417Z"
      fill="currentColor"
    ></path>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-background-deep text-foreground">
      <div className="container mx-auto py-20">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-20">
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[60px] gap-y-12">
              <div className="flex flex-col gap-12">
                <FooterLinkColumn
                  title="MARKETS & ASSETS"
                  links={["News feed", "Assets", "Stock collections", "Industries"]}
                />
                <FooterLinkColumn title="EVENTS & COMMUNITY" links={["Our blog"]} />
              </div>

              <div className="flex flex-col gap-12">
                <FooterLinkColumn
                  title="ANALYTICS & TOOLS"
                  links={["Historical quotes", "Calendars", "Trading specifications"]}
                />
                <FooterLinkColumn
                  title="ABOUT US"
                  links={[
                    "In Numbers",
                    "In the Press",
                    "Awards",
                    "Contact Us",
                    "Sitemap",
                    "Licenses and Safeguards",
                  ]}
                />
              </div>

              <div className="flex flex-col gap-12">
                <FooterLinkColumn
                  title="EDUCATION & LEARNING"
                  links={["Video tutorials", "The basics of margin trading"]}
                />
                <FooterLinkColumn
                  title="SUPPORT & SERVICES"
                  links={["Download app", "Help", "Deposits & withdrawals", "Terms & Conditions"]}
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[296px] flex-shrink-0">
            <div className="grid grid-cols-2 gap-4">
              <ProgramCard
                iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/affiliate-logo-44.svg"
                title="Affiliate Program"
                href="#"
              />
              <ProgramCard
                iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/vip-logo-45.svg"
                title="VIP"
                href="#"
              />
              <ProgramCard
                iconUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/svgs/elite-logo-46.svg"
                title="Elite Club"
                href="#"
              />
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Scan to download app
              </p>
              <div className="flex justify-center">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a9d01dcc-d202-4296-8a1e-f1e869ef1166-iqoption-com/assets/images/images_25.png"
                  alt="QR code to download app"
                  width={140}
                  height={140}
                  className="bg-white p-1 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-border-subtle my-12" />

        <div className="space-y-8">
          <div className="flex flex-wrap justify-between items-center text-sm gap-y-4 gap-x-8">
            <div className="flex items-center gap-6 flex-wrap">
              <a href="#" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">Instagram <ExternalLink size={14} /></a>
              <a href="#" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">X (wc, Twitter) <ExternalLink size={14} /></a>
              <a href="#" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">Facebook <ExternalLink size={14} /></a>
              <a href="#" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">YouTube <ExternalLink size={14} /></a>
            </div>
            <a href="#" className="group flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Got questions?</span>
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">AI bot will help</span>
              <MessageSparkleIcon />
            </a>
          </div>

          <div className="text-xs text-text-tertiary space-y-4 leading-relaxed">
            <p className="font-bold text-muted-foreground">Risk Warning</p>
            <p>The Financial Products offered by the company include Contracts for Difference ('CFDs') and other complex financial products. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, CFDs may not be suitable for all investors because it is possible to lose all of your invested capital. You should never invest money that you cannot afford to lose. Before trading in the complex financial products offered, please ensure to understand the risks involved.</p>
            <p>You are granted limited non-exclusive non-transferable rights to use the IP provided on this website for personal and non-commercial purposes in relation to the services offered on the Website only.</p>
            <p>The information on this website is not directed at residents of certain jurisdictions, including, without limitation, EU/EEA member states, and is not intended for distribution to any person in any country or jurisdiction where such distribution or use would be contrary to local law or regulation.</p>
          </div>

          <div className="flex justify-between items-center text-xs text-text-tertiary pt-4">
            <p>IQ Option, © 2013-2025</p>
            <a href="#" className="hover:text-foreground transition-colors">Powered by quadcode</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;