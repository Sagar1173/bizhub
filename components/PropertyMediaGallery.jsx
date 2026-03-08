"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Grid, Home, X } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const PINCH_SENSITIVITY = 2;
const WHEEL_ZOOM_SENSITIVITY = 0.0028;
const TRACKPAD_PINCH_WHEEL_BOOST = 1.8;
const BUTTON_ZOOM_STEP = 0.2;

export default function PropertyMediaGallery({ images = [] }) {
  const validImages = useMemo(
    () => images.filter((src) => typeof src === "string" && src.length > 0),
    [images],
  );

  const total = validImages.length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenIndices, setBrokenIndices] = useState(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageViewportRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pinchStartRef = useRef({ distance: 0, zoom: 1 });

  if (total === 0) {
    return (
      <div className="w-full h-[300px] md:h-[500px] bg-gray-50 flex flex-col items-center justify-center text-gray-400 rounded-xl border border-dashed border-gray-300">
        <Home size={48} strokeWidth={1} />
        <p className="mt-2 font-medium">No Photos Available</p>
      </div>
    );
  }

  const gridImages = validImages.slice(0, 5);
  const colTwoImages = gridImages.slice(1, 3);
  const colThreeImages = gridImages.slice(3, 5);
  const showViewAllButton = total >= 5;
  const gridColsClass =
    total >= 4
      ? "sm:grid-cols-[1.5fr_1fr_1fr]"
      : total >= 2
        ? "sm:grid-cols-[1.5fr_1fr]"
        : "sm:grid-cols-1";

  const openModal = (index = 0) => {
    setActiveIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const clampPan = (x, y, nextZoom = zoom) => {
    if (!imageViewportRef.current || nextZoom <= MIN_ZOOM) {
      return { x: 0, y: 0 };
    }
    const rect = imageViewportRef.current.getBoundingClientRect();
    const maxX = ((nextZoom - 1) * rect.width) / 2;
    const maxY = ((nextZoom - 1) * rect.height) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const setZoomWithBounds = (nextZoomRaw) => {
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoomRaw));
    setZoom(nextZoom);
    setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
  };

  const setImageByIndex = (index) => {
    setActiveIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const goPrev = () => {
    setImageByIndex((activeIndex - 1 + total) % total);
  };
  const goNext = () => {
    setImageByIndex((activeIndex + 1) % total);
  };
  const zoomIn = () => setZoomWithBounds(zoom + BUTTON_ZOOM_STEP);
  const zoomOut = () => setZoomWithBounds(zoom - BUTTON_ZOOM_STEP);
  const onImageWheel = (e) => {
    if (!isModalOpen) return;
    e.preventDefault();

    const unit =
      e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const normalizedDelta = e.deltaY * unit;
    const sensitivity = e.ctrlKey
      ? WHEEL_ZOOM_SENSITIVITY * TRACKPAD_PINCH_WHEEL_BOOST
      : WHEEL_ZOOM_SENSITIVITY;
    const nextZoom = zoom * Math.exp(-normalizedDelta * sensitivity);

    setZoomWithBounds(nextZoom);
  };

  const onMouseDown = (e) => {
    if (zoom <= MIN_ZOOM) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartRef.current = { distance, zoom };
      return;
    }

    if (e.touches.length === 1 && zoom > MIN_ZOOM) {
      const t = e.touches[0];
      dragStartRef.current = {
        x: t.clientX,
        y: t.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      setIsDragging(true);
    }
  };

  const onTouchMove = (e) => {
    if (!isModalOpen) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = e.touches;
      const currentDistance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY,
      );
      const { distance, zoom: baseZoom } = pinchStartRef.current;
      if (!distance) return;
      const ratio = currentDistance / distance;
      const delta = ratio - 1;
      const boostedDelta =
        Math.sign(delta) * Math.pow(Math.abs(delta), 0.75);
      const nextZoom = baseZoom * (1 + boostedDelta * PINCH_SENSITIVITY);
      setZoomWithBounds(nextZoom);
      return;
    }

    if (e.touches.length === 1 && isDragging && zoom > MIN_ZOOM) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - dragStartRef.current.x;
      const dy = t.clientY - dragStartRef.current.y;
      setPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy));
    }
  };

  const onTouchEnd = () => {
    if (zoom <= MIN_ZOOM) {
      setPan({ x: 0, y: 0 });
    }
    setIsDragging(false);
    pinchStartRef.current = { distance: 0, zoom };
  };

  const markBroken = (index) => {
    setBrokenIndices((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const onMouseMove = (e) => {
      if (!isDragging || zoom <= MIN_ZOOM) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan(
        clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy),
      );
    };

    const onMouseUp = () => setIsDragging(false);

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    const onWheelPreventBrowserZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const onGesture = (e) => e.preventDefault();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheelPreventBrowserZoom, {
      passive: false,
    });
    window.addEventListener("gesturestart", onGesture);
    window.addEventListener("gesturechange", onGesture);
    window.addEventListener("gestureend", onGesture);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheelPreventBrowserZoom);
      window.removeEventListener("gesturestart", onGesture);
      window.removeEventListener("gesturechange", onGesture);
      window.removeEventListener("gestureend", onGesture);
    };
  }, [isModalOpen, isDragging, zoom, activeIndex, total]);

  useEffect(() => {
    if (!isModalOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const previewIndices =
    total > 0
      ? [
          (activeIndex - 1 + total) % total,
          activeIndex,
          (activeIndex + 1) % total,
        ]
      : [];

  return (
    <div className="relative">
      <div
        className={`grid grid-cols-1 ${gridColsClass} gap-1.5 h-[340px] sm:h-[420px] md:h-[520px]`}
      >
        <button
          type="button"
          onClick={() => openModal(0)}
          className="relative col-span-1 row-span-1 rounded-lg overflow-hidden bg-gray-100"
          aria-label="Open image 1"
        >
          {gridImages[0] && !brokenIndices.has(0) ? (
            <img
              src={gridImages[0]}
              alt="Property main"
              onError={() => markBroken(0)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
              <Home size={36} />
              <p className="text-[10px] uppercase font-semibold tracking-wider">
                Image not found
              </p>
            </div>
          )}
        </button>

        {colTwoImages.length > 0 ? (
          <div className="hidden sm:flex flex-col gap-1.5">
            {colTwoImages.map((src, i) => (
              <button
                key={`col2-${i}`}
                type="button"
                onClick={() => openModal(i + 1)}
                className="relative flex-1 rounded-lg overflow-hidden bg-gray-100"
                aria-label={`Open image ${i + 2}`}
              >
                {src && !brokenIndices.has(i + 1) ? (
                  <img
                    src={src}
                    alt={`Property ${i + 2}`}
                    onError={() => markBroken(i + 1)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1.5">
                    <Home size={28} />
                    <p className="text-[9px] uppercase font-semibold tracking-wider">
                      Image not found
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : null}

        {colThreeImages.length > 0 ? (
          <div className="hidden sm:flex flex-col gap-1.5">
            {colThreeImages.map((src, i) => (
              <button
                key={`col3-${i}`}
                type="button"
                onClick={() => openModal(i + 3)}
                className="relative flex-1 rounded-lg overflow-hidden bg-gray-100"
                aria-label={`Open image ${i + 4}`}
              >
                {src && !brokenIndices.has(i + 3) ? (
                  <img
                    src={src}
                    alt={`Property ${i + 4}`}
                    onError={() => markBroken(i + 3)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1.5">
                    <Home size={28} />
                    <p className="text-[9px] uppercase font-semibold tracking-wider">
                      Image not found
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {showViewAllButton ? (
        <button
          type="button"
          onClick={() => openModal(0)}
          className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs sm:text-sm px-4 py-2 rounded-full backdrop-blur-md hover:bg-gray-200 transition-colors flex items-center justify-between cursor-pointer gap-2 border border-gray-400"
        >
          <Grid className="w-4 h-4" />
          View all images
        </button>
      ) : null}

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div className="relative max-w-6xl mx-auto h-full px-4 py-6 flex flex-col">
            <div className="flex items-center justify-between text-white mb-4">
              <div className="text-sm tracking-widest">
                {activeIndex + 1} / {total}
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close gallery"
              >
                <X size={22} />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 md:left-2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>

              {validImages[activeIndex] && !brokenIndices.has(activeIndex) ? (
                <div
                  ref={imageViewportRef}
                  className="relative max-h-[65vh] w-full overflow-hidden rounded-xl bg-black/20"
                  onWheel={onImageWheel}
                  onMouseDown={onMouseDown}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{ touchAction: "none" }}
                >
                  <img
                    src={validImages[activeIndex]}
                    alt={`Property ${activeIndex + 1}`}
                    onError={() => markBroken(activeIndex)}
                    draggable={false}
                    className={`max-h-[65vh] w-full object-contain transition-transform duration-150 ease-out select-none ${
                      isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"
                    }`}
                    style={{
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              ) : (
                <div className="h-[65vh] w-full flex flex-col items-center justify-center rounded-xl bg-white/5 text-white/70 gap-2">
                  <Home size={52} />
                  <p className="text-xs uppercase font-semibold tracking-wider">
                    Image not found
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 md:right-2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="rounded-full border border-white/30 px-3 py-1 text-xs text-white hover:bg-white/10"
                >
                  -
                </button>
                <span className="min-w-14 text-center text-xs text-white/80">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="rounded-full border border-white/30 px-3 py-1 text-xs text-white hover:bg-white/10"
                >
                  +
                </button>
              </div>
              <div className="flex justify-center gap-2">
                {previewIndices.map((i, slotIndex) => (
                  <button
                    key={`thumb-${i}-${slotIndex}`}
                    type="button"
                    onClick={() => setImageByIndex(i)}
                    className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border ${
                      i === activeIndex
                        ? "border-white"
                        : "border-white/20 opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    {validImages[i] && !brokenIndices.has(i) ? (
                      <img
                        src={validImages[i]}
                        alt={`Thumbnail ${i + 1}`}
                        onError={() => markBroken(i)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-white/60 gap-1">
                        <Home size={20} />
                        <p className="text-[8px] uppercase font-semibold tracking-wider">
                          Image not found
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
