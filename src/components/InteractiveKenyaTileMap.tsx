import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Plus, Minus, Layers, Navigation, Sparkles } from 'lucide-react';
import { GeoCoordinate } from '../services/googleMapsEngine';

interface InteractiveKenyaTileMapProps {
  coords: GeoCoordinate;
  zoom?: number;
  mapTypeId?: 'roadmap' | 'hybrid';
  onCoordsChange: (newCoords: GeoCoordinate) => void;
  className?: string;
}

// Convert Lat/Lng to global Web Mercator pixel coordinates at a given zoom level
function latLngToPixel(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const worldSize = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * worldSize;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.max(-0.9999, Math.min(0.9999, sinLat));
  const y = (0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI)) * worldSize;
  return { x, y };
}

// Convert global Web Mercator pixel coordinates back to Lat/Lng
function pixelToLatLng(pixelX: number, pixelY: number, zoom: number): GeoCoordinate {
  const worldSize = 256 * Math.pow(2, zoom);
  const lng = (pixelX / worldSize) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * pixelY) / worldSize;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { 
    lat: Math.max(-85, Math.min(85, lat)), 
    lng: Math.max(-180, Math.min(180, lng)) 
  };
}

export const InteractiveKenyaTileMap: React.FC<InteractiveKenyaTileMapProps> = ({
  coords,
  zoom: initialZoom = 15,
  mapTypeId = 'roadmap',
  onCoordsChange,
  className = 'w-full h-[360px] sm:h-[420px]',
}) => {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [centerCoords, setCenterCoords] = useState<GeoCoordinate>(coords);
  const [isSatellite, setIsSatellite] = useState<boolean>(mapTypeId === 'hybrid');
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 600, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startCenter: GeoCoordinate }>({
    clientX: 0,
    clientY: 0,
    startCenter: coords,
  });

  // Keep center aligned with external coordinate changes when center jumps significantly
  useEffect(() => {
    setCenterCoords(coords);
  }, [coords.lat, coords.lng]);

  // Update container dimensions on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth || 600,
          height: containerRef.current.clientHeight || 400,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute tile grid bounds
  const centerPixel = latLngToPixel(centerCoords.lat, centerCoords.lng, zoom);
  const leftPixel = centerPixel.x - containerSize.width / 2;
  const topPixel = centerPixel.y - containerSize.height / 2;

  const minTileX = Math.floor(leftPixel / 256);
  const maxTileX = Math.floor((leftPixel + containerSize.width) / 256);
  const minTileY = Math.floor(topPixel / 256);
  const maxTileY = Math.floor((topPixel + containerSize.height) / 256);

  const numTiles = Math.pow(2, zoom);

  const tiles = [];
  for (let x = minTileX; x <= maxTileX; x++) {
    for (let y = minTileY; y <= maxTileY; y++) {
      const wrappedX = ((x % numTiles) + numTiles) % numTiles;
      if (y >= 0 && y < numTiles) {
        const tileLeft = x * 256 - leftPixel;
        const tileTop = y * 256 - topPixel;
        
        const tileUrl = isSatellite
          ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${wrappedX}`
          : `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`;

        tiles.push({
          key: `${zoom}-${wrappedX}-${y}-${isSatellite ? 'sat' : 'osm'}`,
          url: tileUrl,
          left: tileLeft,
          top: tileTop,
        });
      }
    }
  }

  // Pin marker pixel position relative to container
  const pinPixel = latLngToPixel(coords.lat, coords.lng, zoom);
  const pinLeft = pinPixel.x - leftPixel;
  const pinTop = pinPixel.y - topPixel;

  // Mouse / Touch handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = false;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startCenter: centerCoords,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.clientX;
      const deltaY = moveEvent.clientY - dragStartRef.current.clientY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        isDraggingRef.current = true;
      }

      const startPix = latLngToPixel(dragStartRef.current.startCenter.lat, dragStartRef.current.startCenter.lng, zoom);
      const newPixX = startPix.x - deltaX;
      const newPixY = startPix.y - deltaY;
      const newCenter = pixelToLatLng(newPixX, newPixY, zoom);
      setCenterCoords(newCenter);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // If user clicked without dragging, place the pin at that click location
      if (!isDraggingRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = upEvent.clientX - rect.left;
        const clickY = upEvent.clientY - rect.top;

        const currentLeftPix = centerPixel.x - containerSize.width / 2;
        const currentTopPix = centerPixel.y - containerSize.height / 2;

        const targetWorldX = currentLeftPix + clickX;
        const targetWorldY = currentTopPix + clickY;

        const newPinCoords = pixelToLatLng(targetWorldX, targetWorldY, zoom);
        onCoordsChange(newPinCoords);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(19, z + 1));
  const handleZoomOut = () => setZoom((z) => Math.max(8, z - 1));

  // Recenter on pin
  const handleRecenter = () => {
    setCenterCoords(coords);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`relative select-none overflow-hidden rounded-2xl border border-[#EEECEC] shadow-inner bg-[#E5E3DF] cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Tile Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            loading="lazy"
            className="absolute transition-opacity duration-200"
            style={{
              left: `${tile.left}px`,
              top: `${tile.top}px`,
              width: '256px',
              height: '256px',
            }}
          />
        ))}
      </div>

      {/* Red Map Pin at exact coordinates */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-transform duration-75"
        style={{ left: `${pinLeft}px`, top: `${pinTop}px` }}
      >
        <div className="flex flex-col items-center">
          <div className="bg-[#C01E25] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg mb-1 whitespace-nowrap border border-white">
            Pinned Installation Site
          </div>
          <div className="w-8 h-8 rounded-full bg-[#C01E25] text-white border-2 border-white shadow-2xl flex items-center justify-center animate-bounce">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
          <div className="w-3 h-1.5 rounded-full bg-black/50 blur-[1px] mt-0.5" />
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSatellite(!isSatellite);
          }}
          className="p-2 rounded-xl bg-white hover:bg-[#EEECEC] text-[#1E1B1C] shadow-md border border-[#EEECEC] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          title="Toggle Satellite Imagery"
        >
          <Layers className="w-4 h-4 text-[#C01E25]" />
          <span className="hidden sm:inline">{isSatellite ? 'Roadmap' : 'Satellite'}</span>
        </button>

        <div className="flex flex-col rounded-xl bg-white shadow-md border border-[#EEECEC] overflow-hidden">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 hover:bg-[#EEECEC] text-[#1E1B1C] border-b border-[#EEECEC] cursor-pointer flex items-center justify-center"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 hover:bg-[#EEECEC] text-[#1E1B1C] cursor-pointer flex items-center justify-center"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleRecenter();
          }}
          className="p-2 rounded-xl bg-white hover:bg-[#EEECEC] text-[#1E1B1C] shadow-md border border-[#EEECEC] cursor-pointer flex items-center justify-center"
          title="Recenter on Pin"
        >
          <Navigation className="w-4 h-4 text-[#C01E25]" />
        </button>
      </div>

      {/* Click / Drag Instructions banner */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md pointer-events-none z-20">
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#EEECEC] shadow-md text-[11px] text-[#1E1B1C] flex items-center gap-2 pointer-events-auto">
          <Sparkles className="w-4 h-4 text-[#C01E25] shrink-0" />
          <span>Click anywhere to place pin, or drag map to navigate Kenya. Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
        </div>
      </div>
    </div>
  );
};
