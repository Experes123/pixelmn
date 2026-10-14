const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
export default {
  reactStrictMode: true,
  allowedDevOrigins: domain ? [domain] : [],
  poweredByHeader: false,
};
