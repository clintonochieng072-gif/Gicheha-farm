import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData,
  canonicalUrl,
  noindex = false,
}) => {
  const siteName = "Gicheha Farm Rongai";
  const defaultDescription =
    "Fresh, organic farm products delivered to your doorstep. Quality eggs, livestock, and vegetables from sustainable farming practices.";
  const defaultImage = "/logo192.png";
  const baseUrl =
    process.env.REACT_APP_BASE_URL || "https://gicheha-farm.onrender.com";

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription = description || defaultDescription;
  const fullImage = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}${defaultImage}`;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Gicheha Farm Rongai" />
      <meta name="language" content="English" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
