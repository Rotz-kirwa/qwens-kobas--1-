import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
} from "react";
import { useNetworkQuality } from "@/context/NetworkQualityContext";

interface AdaptiveImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "loading" | "decoding" | "fetchPriority"
  > {
  src: string;
  highPriority?: boolean;
  revealMargin?: string;
}

const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

const optimizeImageSource = (src: string, quality: "slow" | "medium" | "fast") => {
  if (!src) {
    return src;
  }

  if (src.includes("i.pinimg.com/")) {
    if (quality === "slow") {
      return src.replace(/\/(1200x|736x|564x|474x)\//, "/236x/");
    }
    if (quality === "medium") {
      return src.replace(/\/(1200x|736x|564x|236x)\//, "/474x/");
    }
  }

  return src;
};

const placeholderStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(18, 63, 53, 0.06))",
};

const AdaptiveImage = ({
  src,
  alt,
  className,
  style,
  highPriority = false,
  revealMargin,
  sizes,
  ...props
}: AdaptiveImageProps) => {
  const { quality, isFast, imageLoadingMargin } = useNetworkQuality();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isVisible, setIsVisible] = useState(highPriority || isFast);
  const priorityProps = highPriority ? ({ fetchpriority: "high" } as Record<string, string>) : {};

  const resolvedSrc = useMemo(
    () => optimizeImageSource(src, quality),
    [quality, src],
  );

  useEffect(() => {
    if (highPriority || isFast) {
      setIsVisible(true);
      return;
    }

    const node = imageRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: revealMargin || imageLoadingMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [highPriority, imageLoadingMargin, isFast, revealMargin]);

  return (
    <img
      ref={imageRef}
      src={isVisible ? resolvedSrc : BLANK_IMAGE}
      alt={alt}
      className={className}
      style={isVisible ? style : { ...placeholderStyle, ...style }}
      loading={highPriority ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes}
      {...priorityProps}
      {...props}
    />
  );
};

export default AdaptiveImage;
