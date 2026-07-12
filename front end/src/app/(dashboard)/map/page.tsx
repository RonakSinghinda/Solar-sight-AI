'use client';

import { useEffect, useRef, useState } from 'react';
import { mapApi } from '@/services/api';

type FaultPoint = {
  lat: number;
  lon: number;
  fault_type: string;
  confidence: number;
  inspection_id: string;
  detected_at: string;
};

/** Weight multipliers — mirrors the backend docs */
const SEVERITY: Record<string, number> = {
  hotspot: 1.0,
  crack: 0.8,
  soiling: 0.5,
};

const FILTER_LABELS: Record<string, string> = {
  all: 'All Faults',
  hotspot: 'Hotspot',
  crack: 'Crack',
  soiling: 'Soiling',
};

const FAULT_COLORS: Record<string, string> = {
  hotspot: '#EF4444',
  crack: '#F59E0B',
  soiling: '#3B82F6',
  all: '#A78BFA',
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const heatLayer = useRef<any>(null);

  const initializingRef = useRef(false);

  const [points, setPoints] = useState<FaultPoint[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // ── Load fault data once ──────────────────────────────────────────────────
  useEffect(() => {
    mapApi
      .getFaultPoints()
      .then((data: FaultPoint[]) => {
        // Normalize fault types to match frontend keys ('hotspot', 'crack', 'soiling')
        const normalized = data.map((p) => {
          let type = p.fault_type.toLowerCase();
          if (type.includes('crack')) {
            type = 'crack';
          }
          return {
            ...p,
            fault_type: type,
          };
        });
        setPoints(normalized);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ── Init Leaflet map once DOM node is mounted ─────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletMap.current || initializingRef.current) return;
    initializingRef.current = true;

    // Inject Leaflet CSS (idempotent)
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Dynamically import Leaflet (avoids Next.js SSR issues)
    import('leaflet').then((leafletModule) => {
      // leaflet-heat CDN script patches window.L, NOT the ESM module.
      // We must set window.L to our ESM import so the CDN script can find it,
      // AND we must read window.L back when creating the heat layer (not the ESM object).
      const win = window as any;
      win.L = leafletModule;

      // Check if leaflet-heat script is already loaded/loading
      let script = document.getElementById('leaflet-heat-script') as HTMLScriptElement;

      // Use the ESM L for standard Leaflet APIs; use win.L for heat layer
      const L = leafletModule;

      const initializeMap = () => {
        if (!mapRef.current || leafletMap.current) return;
        
        // Double check if container is already initialized by Leaflet
        if ((mapRef.current as any)._leaflet_id) return;

        const map = L.map(mapRef.current, { zoomControl: false }).setView(
          [20.5937, 78.9629],
          5
        );

        // Custom zoom control placement (top-right)
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Satellite tile layer
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            attribution:
              'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
            maxZoom: 20,
          }
        ).addTo(map);

        // Hybrid labels overlay (shows place names on satellite)
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 20, opacity: 0.7 }
        ).addTo(map);

        leafletMap.current = map;

        // IMPORTANT: Use win.L.heatLayer — the CDN leaflet-heat plugin patches
        // window.L, NOT the ESM import. (L as any).heatLayer crashes because
        // the ESM module object and window.L can be different references.
        if (typeof win.L.heatLayer === 'function') {
          const H = win.L.heatLayer([], {
            radius: 35,
            blur: 25,
            maxZoom: 17,
            gradient: {
              0.2: '#3B82F6',
              0.5: '#F59E0B',
              0.8: '#EF4444',
              1.0: '#7F1D1D',
            },
          }).addTo(map);
          heatLayer.current = H;
        } else {
          console.warn('leaflet-heat not ready — heat overlay disabled');
        }

        setMapReady(true);

        // Leaflet must recalculate its size after the framer-motion
        // page-transition animation finishes (AppShell uses 0.4s ease).
        // Without this, tiles render into a 0×0 box and appear invisible.
        setTimeout(() => {
          map.invalidateSize();
        }, 500);
      };

      if (!script) {
        script = document.createElement('script');
        script.id = 'leaflet-heat-script';
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js';
        script.onload = initializeMap;
        script.onerror = () => {
          // CDN failed — still show the map, just without heat overlay
          console.warn('Failed to load leaflet-heat from CDN');
          initializeMap();
        };
        document.head.appendChild(script);
      } else {
        // Script tag already in DOM — check via window.L (not ESM module)
        if (typeof win.L.heatLayer === 'function') {
          initializeMap();
        } else {
          // Still loading — chain onto existing onload
          const oldOnload = script.onload;
          script.onload = (e) => {
            if (oldOnload) (oldOnload as any)(e);
            initializeMap();
          };
        }
      }
    });

    return () => {
      // Cleanup map on unmount
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
      initializingRef.current = false;
      setMapReady(false);
    };
  }, []);

  // ── Update heatmap whenever points or filter changes ─────────────────────
  useEffect(() => {
    if (!heatLayer.current || !mapReady) return;

    const filtered =
      filter === 'all' ? points : points.filter((p) => p.fault_type === filter);

    const heatData = filtered.map((p) => [
      p.lat,
      p.lon,
      p.confidence * (SEVERITY[p.fault_type] ?? 0.6),
    ]);

    heatLayer.current.setLatLngs(heatData);

    // Auto-fit bounds to data extent
    if (heatData.length > 0 && leafletMap.current) {
      const win = window as any;
      const bounds = win.L.latLngBounds(
        heatData.map(([lat, lon]: number[]) => [lat, lon])
      );
      leafletMap.current.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [points, filter, mapReady]);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const visible =
    filter === 'all' ? points : points.filter((p) => p.fault_type === filter);
  const avgConf =
    visible.length > 0
      ? (visible.reduce((s, p) => s + p.confidence, 0) / visible.length).toFixed(2)
      : '—';
  const countByType = points.reduce<Record<string, number>>((acc, p) => {
    acc[p.fault_type] = (acc[p.fault_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="-m-4 md:-m-8"
      style={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f1117',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          zIndex: 10,
          minHeight: 56,
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 0 auto' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22d3ee',
              boxShadow: '0 0 8px #22d3ee',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            Fault Density Map
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            {visible.length} / {points.length} pts
          </span>
        </div>

        {/* Filter buttons — scrollable row on mobile */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(255,255,255,0.04)',
            padding: '4px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
            overflowX: 'auto',
            flexShrink: 0,
            maxWidth: '100%',
          }}
        >
          {Object.keys(FILTER_LABELS).map((type) => {
            const active = filter === type;
            return (
              <button
                key={type}
                id={`map-filter-${type}`}
                onClick={() => setFilter(type)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 7,
                  fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  border: 'none',
                  whiteSpace: 'nowrap',
                  background: active
                    ? FAULT_COLORS[type] + '22'
                    : 'transparent',
                  color: active ? FAULT_COLORS[type] : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  outline: active
                    ? `1px solid ${FAULT_COLORS[type]}55`
                    : 'none',
                }}
              >
                {FILTER_LABELS[type]}
              </button>
            );
          })}
        </div>

        {/* Avg confidence badge */}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.04)',
            padding: '4px 10px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Avg conf:&nbsp;
          <span style={{ color: '#22d3ee', fontWeight: 600 }}>{avgConf}</span>
        </div>
      </div>

      {/* ── Map + overlay stack ────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative' }}>

        {/* Loading overlay */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15,17,23,0.88)',
              zIndex: 20,
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '3px solid rgba(34,211,238,0.2)',
                borderTopColor: '#22d3ee',
                animation: 'spin 0.9s linear infinite',
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              Loading fault data…
            </span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15,17,23,0.88)',
              zIndex: 20,
            }}
          >
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12,
                padding: '20px 28px',
                color: '#fca5a5',
                fontSize: 13,
                textAlign: 'center',
                maxWidth: 340,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Failed to load map data</div>
              <div style={{ opacity: 0.7 }}>{error}</div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            zIndex: 10,
            background: 'rgba(15,17,23,0.82)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '14px 18px',
            minWidth: 160,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            Heat Scale
          </div>
          {/* Gradient bar */}
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background:
                'linear-gradient(to right, #3B82F6, #F59E0B, #EF4444, #7F1D1D)',
              marginBottom: 6,
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <span>Low</span>
            <span>High</span>
          </div>

          {/* Per-type counts */}
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {['hotspot', 'crack', 'soiling'].map((t) => (
              <div
                key={t}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: FAULT_COLORS[t],
                    boxShadow: `0 0 5px ${FAULT_COLORS[t]}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.55)',
                    flex: 1,
                    textTransform: 'capitalize',
                  }}
                >
                  {t}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: FAULT_COLORS[t],
                  }}
                >
                  {countByType[t] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* No-data notice */}
        {!loading && !error && points.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              zIndex: 10,
              background: 'rgba(15,17,23,0.82)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '28px 36px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
            }}
          >
            <div
              style={{ fontSize: 28, marginBottom: 10, filter: 'grayscale(1)' }}
            >
              🛰
            </div>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              No GPS faults yet
            </div>
            <div style={{ fontSize: 12 }}>
              Upload drone images with EXIF data
              <br />
              or run an inspection to populate the map.
            </div>
          </div>
        )}

        {/* Leaflet container */}
        <div
          id="fault-map-container"
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
