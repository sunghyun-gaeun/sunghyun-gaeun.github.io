import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";
import React, { useState, useEffect } from "react";
import { getImagesById } from "@/layout/Gallery/Images.ts";

interface ImageSize {
  alt: string;
  thumbnail: string;
  original: string;
  width: number;
  height: number;
}

const PhotoGallery = ({ id }: { id: string }) => {
  const [imageSizes, setImageSizes] = useState<ImageSize[]>([]);
  const images = getImagesById(id);

  useEffect(() => {
    const loadImageSizes = async () => {
      const sizes = await Promise.all(
        images.map((image) => {
          return new Promise<ImageSize>((resolve) => {
            const img = new Image();
            img.src = image.original;

            img.onload = () => {
              resolve({
                alt: image.alt,
                thumbnail: image.thumbnail,
                original: image.original,
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
            };

            img.onerror = () => {
              resolve({
                alt: image.alt,
                thumbnail: image.thumbnail,
                original: image.original,
                width: 1200,
                height: 800,
              });
            };
          });
        })
      );

      setImageSizes(sizes);
    };

    loadImageSizes();
  }, [id]);

  const smallItemStyles: React.CSSProperties = {
    cursor: "pointer",
    objectFit: "cover",
    width: "100%",
    height: "100%",
    borderRadius: "5px",
    display: "block",
    backgroundColor: "#f2f2f2",
  };

  return (
    <Gallery>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(130px, 1fr))",
          gridAutoRows: "130px",
          gap: 8,
        }}
      >
        {imageSizes.map((image, index) => (
          <Item
            key={index}
            cropped
            original={image.original}
            thumbnail={image.thumbnail}
            width={image.width}
            height={image.height}
          >
            {({ ref, open }) => (
              <img
                ref={ref as React.Ref<HTMLImageElement>}
                onClick={open}
                src={image.thumbnail}
                alt={image.alt}
                style={smallItemStyles}
                loading="lazy"
              />
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
};

export default PhotoGallery;