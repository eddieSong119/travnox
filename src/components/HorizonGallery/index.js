"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const ROW_HEIGHT = 430;
const IMAGE_GAP = 20;
const MOBILE_BREAKPOINT = 768;

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
 * Gallery Image (desktop horizontal rows)
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
 * Horizontal / Vertical Gallery
 * =========================================================
 */
export default function HorizontalGallery({ section }) {
  const viewportRef = useRef(null);
  const mobileViewportRef = useRef(null);
  const locationRefs = useRef({});

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
   * Locations (nav metadata, first image per location)
   * =======================================================
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
   * Mobile: group images by location
   * =======================================================
   */
  const groups = useMemo(() => {
    const result = [];
    const seen = new Map();

    images.forEach((image) => {
      if (!seen.has(image.location)) {
        const group = { location: image.location, images: [] };
        seen.set(image.location, group);
        result.push(group);
      }

      seen.get(image.location).images.push(image);
    });

    return result;
  }, [images]);

  /**
   * =======================================================
   * Desktop: split into two rows
   * =======================================================
   */
  const firstRow = useMemo(() => {
    return images.filter((_, index) => index % 2 === 0);
  }, [images]);

  const secondRow = useMemo(() => {
    return images.filter((_, index) => index % 2 === 1);
  }, [images]);

  const getImageOffset = useCallback(
    (rowIndex) => {
      return firstRow.slice(0, rowIndex).reduce((total, image) => {
        const width = ROW_HEIGHT * (image.width / image.height);

        return total + width + IMAGE_GAP;
      }, 0);
    },
    [firstRow],
  );

  const isMobile = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < MOBILE_BREAKPOINT;
  }, []);

  /**
   * =======================================================
   * Scroll to location
   * =======================================================
   */
  const scrollToLocation = useCallback(
    (originalIndex) => {
      const location = images[originalIndex]?.location;

      if (!location) {
        return;
      }

      setActiveLocation(location);

      if (isMobile()) {
        const container = mobileViewportRef.current;
        const groupEl = locationRefs.current[location];

        if (container && groupEl) {
          const top =
            groupEl.getBoundingClientRect().top -
            container.getBoundingClientRect().top +
            container.scrollTop;

          container.scrollTo({
            top,
            behavior: "smooth",
          });
        }

        return;
      }

      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const rowIndex = Math.floor(originalIndex / 2);
      const offset = getImageOffset(rowIndex);

      viewport.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    },
    [getImageOffset, images, isMobile],
  );

  /**
   * =======================================================
   * Mobile: active location from vertical scroll
   * =======================================================
   */
  const handleMobileScroll = () => {
    const container = mobileViewportRef.current;

    if (!container) {
      return;
    }

    const scrollTop = container.scrollTop;
    let currentLocation = groups[0]?.location || "";

    for (const group of groups) {
      const el = locationRefs.current[group.location];

      if (!el) {
        continue;
      }

      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;

      if (top <= scrollTop + 80) {
        currentLocation = group.location;
      }
    }

    if (currentLocation !== activeLocation) {
      setActiveLocation(currentLocation);
    }
  };
  /**
   * =======================================================
   * Desktop pointer drag
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
   * Desktop: active location from horizontal scroll
   * =======================================================
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
          Mobile: vertical groups by location
      ================================================= */}
      <div
        ref={mobileViewportRef}
        className="max-h-[70vh] overflow-y-auto overscroll-y-contain no-scrollbar px-5 md:hidden"
        onScroll={handleMobileScroll}
      >
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <div
              key={group.location}
              ref={(el) => {
                locationRefs.current[group.location] = el;
              }}
              data-location={group.location}
            >
              <div className="flex flex-col gap-5">
                {group.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative w-full overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      draggable={false}
                      className="h-auto w-full select-none object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          Desktop: horizontal dual-row viewport
      ================================================= */}
      <div
        ref={viewportRef}
        className="
          hidden
          w-full
          overflow-x-auto
          overflow-y-hidden
          select-none
          scrollbar-none
          md:block
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
        <div className="w-max pl-5 md:pl-20">
          <div className="flex gap-5">
            {firstRow.map((image) => (
              <GalleryImageItem key={image.id} image={image} />
            ))}
          </div>

          <div className="mt-5 flex gap-5">
            {secondRow.map((image) => (
              <GalleryImageItem key={image.id} image={image} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
