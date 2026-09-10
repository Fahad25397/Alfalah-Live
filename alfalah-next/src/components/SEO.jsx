"use client";
import React from 'react';
import Script from 'next/script';

const SEO = ({ title, description, url, image, schema }) => {
  // Support schema as a single object or an array of objects
  const schemas = schema
    ? Array.isArray(schema) ? schema : [schema]
    : [];

  return (
    <>
      {/* Standard & Open Graph & Twitter Meta via React 19 <head> hoisting */}
      <head>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        {url && <link rel="canonical" href={url} />}

        {/* Robots AIO directives */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Alfalah Honey" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Alfalah Honey" />
        <meta property="og:locale" content="en_US" />
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {url && <meta property="og:url" content={url} />}
        {image && <meta property="og:image" content={image} />}
        {image && <meta property="og:image:alt" content={title || 'Alfalah Honey Product'} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@alfalah_honey" />
        {title && <meta name="twitter:title" content={title} />}
        {description && <meta name="twitter:description" content={description} />}
        {image && <meta name="twitter:image" content={image} />}
      </head>

      {/* Structured Data (JSON-LD) via Next.js Script — renders in <head> */}
      {schemas.map((s, idx) => (
        <Script
          key={`jsonld-${idx}`}
          id={`structured-data-${idx}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
};

export default SEO;
