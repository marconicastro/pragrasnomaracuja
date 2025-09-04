import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Controle de Trips - Economize até R$ 5.000 por Hectare",
  description: "Método validado pela EMBRAPA que elimina o trips de vez em 28 dias. Sistema de 4 fases com 94% de sucesso e economia de até R$ 5.000 por Hectare.",
  keywords: ["trips", "controle de trips", "maracujá", "agricultura", "EMBRAPA", "defensivos", "pragas", "sistema 4 fases"],
  openGraph: {
    title: "Sistema de Controle de Trips - Economize até R$ 5.000 por Hectare",
    description: "Elimine o trips de vez com método científico validado pela EMBRAPA. Economize milhares em defensivos ineficazes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* SCRIPT PARA RASTREAMENTO DE UTMS */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids
          async
          defer
        />

        {/* SCRIPT DO PIXEL DA UTMIFY */}
        <Script
          id="utmify-pixel-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.pixelId = "68aef5df7fe9644ed8977c6d";
                var script = document.createElement("script");
                script.async = true;
                script.defer = true;
                script.src = "https://cdn.utmify.com.br/scripts/pixel/pixel.js";
                document.head.appendChild(script);
                
                // Verificar se o pixel foi carregado corretamente
                script.onload = function() {
                  if (typeof window.utmifyPixel !== 'undefined') {
                    console.log('Pixel Utmify carregado com sucesso');
                  } else {
                    console.log('Pixel Utmify não foi carregado');
                  }
                };
                
                script.onerror = function() {
                  console.log('Erro ao carregar o Pixel Utmify');
                };
              })();
            `,
          }}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}