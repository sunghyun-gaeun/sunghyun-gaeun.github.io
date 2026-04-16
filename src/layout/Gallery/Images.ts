export interface ImageInfo {
  alt: string;
  thumbnail: string;
  original: string;
}

export const getImagesById = (id: string): ImageInfo[] => {
  const thumbModules = import.meta.glob(
    "/src/assets/*/gallery/thumb/*.{jpg,jpeg,png}",
    { eager: true }
  );

  const originalModules = import.meta.glob(
    "/src/assets/*/gallery/original/*.{jpg,jpeg,png}",
    { eager: true }
  );

  const thumbs = Object.entries(thumbModules)
    .filter(([path]) => path.includes(`/assets/${id}/`))
    .map(([path, mod]) => {
      const filename = path.split("/").pop()?.split(".")[0] || "unknown";
      return {
        alt: filename,
        thumbnail: (mod as { default: string }).default,
      };
    });

  const originals = Object.entries(originalModules)
    .filter(([path]) => path.includes(`/assets/${id}/`))
    .map(([path, mod]) => {
      const filename = path.split("/").pop()?.split(".")[0] || "unknown";
      return {
        alt: filename,
        original: (mod as { default: string }).default,
      };
    });

  const merged = thumbs.map((thumb) => {
    const matched = originals.find((o) => o.alt === thumb.alt);
    return {
      alt: thumb.alt,
      thumbnail: thumb.thumbnail,
      original: matched?.original ?? thumb.thumbnail,
    };
  });

  return merged.sort((a, b) =>
    a.alt.localeCompare(b.alt, undefined, { numeric: true })
  );
};

export const getMainImageById = (id: string) => {
  const modules = import.meta.glob("/src/assets/*/main/main.{jpg,jpeg,png}", {
    eager: true,
  });

  const filtered = Object.entries(modules)
    .filter(([path]) => path.includes(`/assets/${id}/`))
    .map(([path, mod]) => {
      const filename = path.split("/").pop()?.split(".")[0] || "unknown";
      return {
        alt: filename,
        source: (mod as { default: string }).default,
      };
    });

  return filtered.sort((a, b) => a.alt.localeCompare(b.alt));
};