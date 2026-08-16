"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const ROW_HEIGHT = 430;
const IMAGE_GAP = 20;
const DESKTOP_MIN_WIDTH = 768;

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
      className="relative h-[430px] w-auto shrink-0 overflow-hidden"
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
 *
 * Desktop (wide viewport): optional mouse drag
 * Mobile / DevTools mobile width: native scroll only
 *
 * Important: min-w-0 keeps the wide track from expanding
 * the page (flex default min-width:auto breaks scroll).
 * =========================================================
 */
export default function HorizontalGallery({ section }) {
  const viewportRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const initialScrollLeft = useRef(0);

  const [activeLocation, setActiveLocation] = useState(
    section?.content?.[0]?.title || "",
  );

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

  const scrollToLocation = useCallback(
    (originalIndex) => {
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

      const location = images[originalIndex]?.location;

      if (location) {
        setActiveLocation(location);
      }
    },
    [getImageOffset, images],
  );

  const canMouseDrag = () => {
    if (typeof window === "undefined") {
      return false;
    }

    // DevTools mobile width must use native scroll — mouse
    // pointer capture would block vertical page scroll.
    return window.innerWidth >= DESKTOP_MIN_WIDTH;
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || !canMouseDrag()) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    isDraggingRef.current = true;
    dragStartX.current = event.clientX;
    initialScrollLeft.current = viewport.scrollLeft;
    viewport.style.cursor = "grabbing";
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current || event.pointerType !== "mouse") {
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
    if (event.pointerType !== "mouse") {
      return;
    }

    isDraggingRef.current = false;

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.style.cursor = "";

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

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
    <section className="w-full min-w-0 max-w-full pt-4">
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

      <div
        ref={viewportRef}
        className="
          w-full
          min-w-0
          max-w-full
          overflow-x-auto
          overflow-y-hidden
          overscroll-x-contain
          select-none
          no-scrollbar
          md:cursor-grab
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="flex w-max max-w-none flex-col pl-5 md:pl-20">
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
