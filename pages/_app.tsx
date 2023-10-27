import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import type { AppProps } from "next/app";
import { DocsContextProvider } from "layouts/DocsPage/context";
import { posthog, sendPageview } from "utils/posthog";
import { TabContextProvider } from "components/Tabs";

// https://larsmagnus.co/blog/how-to-optimize-custom-fonts-with-next-font
// Next Font to enable zero layout shift which is hurting SEO.
import localUbuntu from "next/font/local";
import localLato from "next/font/local";
const ubuntu = localUbuntu({
  src: "../styles/assets/ubuntu-mono-400.woff2",
  variable: "--font-ubunt",
  display: "swap",
});
export const lato = localLato({
  src: [
    {
      path: "../styles/assets/lato-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../styles/assets/lato-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../styles/assets/lato-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../styles/assets/lato-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../styles/assets/lato-900.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../styles/assets/lato-900-italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-lato",
  display: "swap",
});

import "styles/varaibles.css";
import "styles/global.css";

const NEXT_PUBLIC_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const NEXT_PUBLIC_GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;

interface dataLayerItem {
  [key: string]: unknown;
  event?: string;
}

declare global {
  var dataLayer: dataLayerItem[]; // eslint-disable-line no-var
}

const Analytics = () => {
  return (
    <>
      <Script id="add_dataLayer">
        {`window.dataLayer = window.dataLayer || []`}
      </Script>
      {NEXT_PUBLIC_GTM_ID && (
        <>
          {/* Google Tag Manager */}
          <Script id="script_gtm">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${NEXT_PUBLIC_GTM_ID}');`}
          </Script>

          {/* End Google Tag Manager */}
          {/* Google Tag Manager (noscript) */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          {/* End Google Tag Manager (noscript) */}
        </>
      )}
      {NEXT_PUBLIC_GTAG_ID && (
        <>
          {/* GTAG */}
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GTAG_ID}`}
          />
          <Script id="script_gtag">
            {`window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', "${NEXT_PUBLIC_GTAG_ID}", {
                    send_page_view: false
                  });`}
          </Script>
          {/* End GTag */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          {/* End Google Tag Manager (noscript) */}
        </>
      )}
    </>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    posthog(); // init posthog

    router.events.on("routeChangeComplete", sendPageview);

    return () => {
      router.events.off("routeChangeComplete", sendPageview);
    };
  }, [router.events]);

  return (
    <>
      <style jsx global>{`
        :root {
          --font-base: ${lato.style.fontFamily};
          --font-ubunt: ${ubuntu.style.fontFamily};
        }
      `}</style>
      <Analytics />
      <DocsContextProvider>
        <TabContextProvider>
          <Component {...pageProps} />
        </TabContextProvider>
      </DocsContextProvider>
    </>
  );
};

export default MyApp;
