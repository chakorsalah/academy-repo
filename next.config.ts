import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
};
export default withPayload(nextConfig);
