import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConsentBanner from '@/components/ConsentBanner';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Controle de Trips - Ebook Agronegócio',
  description: 'Sistema de 4 Fases que elimina o trips de vez e economiza até R$ 5.000 por hectare em defensivos ineficazes. Método validado pela EMBRAPA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Tag Manager - Server-Side */}
        <Script
          id="gtm-server-side"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://event.maracujazeropragas.com/85wpwsohvcad.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','8m=DQVeMTwiXiAnJTNEMiM7URJcUVhZSRcZWQwCBAkMBh0FGwYEBx8BFgMAEFgLAB4%3D');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://event.maracujazeropragas.com/ns.html?id=GTM-WCDP2ZLH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ConsentBanner />
        {children}
      </body>
    </html>
  );
}
