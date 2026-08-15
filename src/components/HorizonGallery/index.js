"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const ROW_HEIGHT = 430;
const IMAGE_GAP = 20;

/**
 * =========================================================
 * Strapi image adapter
 * =========================================================
 */
const getImageAttributes = (image, location) => {
  return {
    id: image.id,
    location,
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alternativeText || image.name,
  };
};

/**
 * =========================================================
 * Gallery Image
 * =========================================================
 */
function GalleryImageItem({ image }) {
  const width = ROW_HEIGHT * (image.width / image.height);

  return (
    <div
      className="relative h-[430px] shrink-0 overflow-hidden"
      style={{
        width,
      }}
    >
      <img
        src={image.url}
        alt={image.alt}
        draggable={false}
        className="
          pointer-events-none
          h-full
          w-full
          select-none
          object-cover
        "
      />
    </div>
  );
}

/**
 * =========================================================
 * Horizontal Gallery
 * =========================================================
 */
export default function HorizontalGallery({ section }) {
  const viewportRef = useRef(null);

  /**
   * DOM anchors for locations.
   *
   * The key is the global image index.
   */
  const anchorRefs = useRef({});

  const [activeLocation, setActiveLocation] = useState(
    section?.content?.[0]?.title || "",
  );

  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const initialScrollLeft = useRef(0);

  /**
   * =======================================================
   * Flatten all Strapi images
   * =======================================================
   *
   * The order here is extremely important.
   *
   * Example:
   *
   * 0  KUNMING
   * 1  KUNMING
   * 2  DALI
   * 3  DALI
   * 4  DALI
   * 5  LIJIANG
   * 6  LIJIANG
   */
  const images = useMemo(() => {
    if (!section?.content) {
      return [];
    }

    return section.content.flatMap((content) =>
      (content.activity || [])
        .filter((activity) => activity.image)
        .map((activity) => getImageAttributes(activity.image, content.title)),
    );
  }, [section]);

  /**
   * =======================================================
   * Locations
   * =======================================================
   *
   * Find the first image belonging to each location.
   *
   * This is ONLY navigation metadata.
   *
   * It does NOT affect gallery layout.
   */
  const locations = useMemo(() => {
    const result = [];
    const seen = new Set();

    images.forEach((image, index) => {
      if (seen.has(image.location)) {
        return;
      }

      seen.add(image.location);

      result.push({
        location: image.location,
        index,
      });
    });

    return result;
  }, [images]);

  /**
   * =======================================================
   * Split into two rows
   * =======================================================
   *
   * IMPORTANT:
   *
   * We split the already-flattened array.
   *
   * Therefore both rows represent exactly the same
   * horizontal coordinate system.
   */
  const firstRow = useMemo(() => {
    return images.filter((_, index) => index % 2 === 0);
  }, [images]);

  const secondRow = useMemo(() => {
    return images.filter((_, index) => index % 2 === 1);
  }, [images]);

  /**
   * =======================================================
   * Calculate horizontal offset
   * =======================================================
   *
   * Since every image has its own width, the offset cannot
   * simply be:
   *
   * index * fixedWidth
   *
   * We calculate the accumulated width of previous images.
   */
  const getImageOffset = useCallback(
    (rowIndex) => {
      return firstRow.slice(0, rowIndex).reduce((total, image) => {
        const width = ROW_HEIGHT * (image.width / image.height);

        return total + width + IMAGE_GAP;
      }, 0);
    },
    [firstRow],
  );

  /**
   * =======================================================
   * Scroll to location
   * =======================================================
   *
   * Location index refers to the ORIGINAL flattened
   * image array.
   *
   * Since the navigation anchor is based on the first row,
   * convert the original index to first-row index.
   */
  const scrollToLocation = useCallback(
    (originalIndex) => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      /**
       * Original index:
       *
       * 0 -> first row index 0
       * 2 -> first row index 1
       * 4 -> first row index 2
       */
      const rowIndex = Math.floor(originalIndex / 2);

      const offset = getImageOffset(rowIndex);

      viewport.scrollTo({
        left: offset,
        behavior: "smooth",
      });

      const location = images[originalIndex]?.location;

      if (location) {
        setActiveLocation(location);
      }
    },
    [getImageOffset, images],
  );

  /**
   * =======================================================
   * Pointer drag
   * =======================================================
   */
  const handlePointerDown = (event) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    setIsDragging(true);

    dragStartX.current = event.clientX;

    initialScrollLeft.current = viewport.scrollLeft;

    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const delta = event.clientX - dragStartX.current;

    viewport.scrollLeft = initialScrollLeft.current - delta;
  };

  const handlePointerUp = (event) => {
    setIsDragging(false);

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  /**
   * =======================================================
   * Active location
   * =======================================================
   *
   * Determine which location is currently closest to the
   * left edge of the gallery.
   */
  const handleScroll = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const scrollLeft = viewport.scrollLeft;

    let currentLocation = locations[0]?.location || "";

    for (const location of locations) {
      const rowIndex = Math.floor(location.index / 2);

      const offset = getImageOffset(rowIndex);

      if (offset <= scrollLeft + 100) {
        currentLocation = location.location;
      }
    }

    if (currentLocation !== activeLocation) {
      setActiveLocation(currentLocation);
    }
  };

  return (
    <section className="w-full pt-4">
      {/* =================================================
          Navigation
      ================================================= */}
      <nav className="mb-10 w-full max-w-full overflow-x-auto overscroll-x-contain no-scrollbar">
        <div className="flex w-max min-w-full justify-center gap-8 px-5 md:px-20">
          {locations.map((location) => (
            <button
              key={location.location}
              type="button"
              onClick={() => scrollToLocation(location.index)}
              className={`
                shrink-0
                text-sm
                font-medium
                uppercase
                tracking-wide
                transition-colors
                ${
                  activeLocation === location.location
                    ? "text-black"
                    : "text-black/30"
                }
              `}
            >
              {location.location}
            </button>
          ))}
        </div>
      </nav>

      {/* =================================================
          Viewport
      ================================================= */}
      <div
        ref={viewportRef}
        className="
          w-full
          overflow-x-auto
          overflow-y-hidden
          select-none
          scrollbar-none
        "
        style={{
          cursor: isDragging ? "grabbing" : "grab",

          touchAction: "pan-y",
        }}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* =================================================
            Track
        ================================================= */}
        <div
          className="
            w-max
            pl-5
            md:pl-20
          "
        >
          {/* =================================================
              FIRST ROW

              One continuous flex row.
              Every image gap = exactly 20px.
          ================================================= */}
          <div
            className="
              flex
              gap-5
            "
          >
            {firstRow.map((image, index) => (
              <GalleryImageItem key={image.id} image={image} />
            ))}
          </div>

          {/* =================================================
              SECOND ROW

              One continuous flex row.
          ================================================= */}
          <div
            className="
              mt-5
              flex
              gap-5
            "
          >
            {secondRow.map((image) => (
              <GalleryImageItem key={image.id} image={image} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
