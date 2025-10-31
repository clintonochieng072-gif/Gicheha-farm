import React, { useState, useRef, useEffect } from "react";
import LazyLoad from "react-lazyload";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholder,
  onLoad,
  onError,
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const imgRef = useRef(null);

  // Generate WebP version if supported
  const generateWebPSrc = (originalSrc) => {
    if (!originalSrc) return "";
    // For external URLs, we'll assume they might have WebP versions
    // For local images, we could implement server-side WebP conversion
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  };

  // Generate responsive image sources
  const generateSrcSet = (originalSrc) => {
    if (!originalSrc) return "";
    const baseUrl = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const extension =
      originalSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || "jpg";

    // Generate multiple sizes
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map((size) => `${baseUrl}_${size}.${extension} ${size}w`)
      .join(", ");
  };

  useEffect(() => {
    if (src) {
      // Check if browser supports WebP
      const webpSupported = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      };

      // Use WebP if supported, otherwise fallback to original
      const finalSrc = webpSupported() ? generateWebPSrc(src) : src;
      setImageSrc(finalSrc);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const handleError = () => {
    setHasError(true);
    // Fallback to original image if WebP fails
    if (imageSrc !== src && src) {
      setImageSrc(src);
      setHasError(false);
    }
    onError && onError();
  };

  const ImageComponent = () => (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-secondary-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          {placeholder || (
            <div className="text-secondary-400 text-sm">Loading...</div>
          )}
        </div>
      )}

      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          srcSet={generateSrcSet(imageSrc)}
          sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px"
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${hasError ? "hidden" : ""}`}
          {...props}
        />
      )}

      {hasError && (
        <div
          className="flex items-center justify-center bg-secondary-100 text-secondary-500"
          style={{ width, height }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}
    </div>
  );

  // Use LazyLoad for non-priority images
  if (!priority) {
    return (
      <LazyLoad
        height={height || 200}
        offset={100}
        placeholder={
          <div
            className={`bg-secondary-200 animate-pulse flex items-center justify-center ${className}`}
            style={{ width, height: height || 200 }}
          >
            {placeholder || (
              <div className="text-secondary-400 text-sm">Loading...</div>
            )}
          </div>
        }
      >
        <ImageComponent />
      </LazyLoad>
    );
  }

  return <ImageComponent />;
};

export default OptimizedImage;
