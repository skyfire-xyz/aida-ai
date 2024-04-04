import { ImageLoader } from "next/image";

const CLOUDFLARE_IMAGE_PATH =
  process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_PATH || "WemO4_3zZlyNq-8IGpxrAQ";
const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

/*
 * Accepts an Cloudflare Images image ID (`src`) and width (`width`)
 * Returns a URL for the next-size-up image variant (with a fallback to the largest)
 */
export const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
  // Return original images from /public/images in development
  if (process.env.NODE_ENV === "development") {
    return src;
  }

  // Note that `width` might be larger than you're expecting because of a device pixel ratio (DPR)
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");

  // Next.js expects to see the width somewhere in the URL,
  // so we add the no-op `width` query parameter to suppress the warning
  // https://nextjs.org/docs/messages/next-image-missing-loader-width
  return `https://imagedelivery.net/${CLOUDFLARE_IMAGE_PATH}/marketplace/${normalizeSrc(
    src
  )}/${paramsString}`;
};

export const defaultImageLoader: ImageLoader = ({ src }) => {
  return src;
};
