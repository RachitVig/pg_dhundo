import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Professional Map Markers
const createMarkerIcon = (color) => L.divIcon({
  className: 'custom-pro-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2)"></div>`,
  iconSize: [14, 14]
});

const icons = {
  BOYS: createMarkerIcon('#2563eb'), // Primary Blue
  GIRLS: createMarkerIcon('#db2777'), // Pink
  MIXED: createMarkerIcon('#4f46e5')  // Indigo
};

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function SmartMap({ pgs, center, radius }) {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ChangeView center={center} />
        
        {/* Radius Area Focus */}
        <Circle 
          center={center} 
          radius={radius * 1000} 
          pathOptions={{ fillColor: '#2563eb', fillOpacity: 0.05, color: '#2563eb', weight: 1, dashArray: '4' }} 
        />

        {pgs.map(pg => (
          <Marker 
            key={pg.id} 
            position={[pg.lat, pg.lng]} 
            icon={icons[pg.gender_category] || icons.MIXED}
          >
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-slate-800 m-0">{pg.name}</h4>
                <p className="text-xs text-slate-500 m-0 mt-1">Starting ₹{Math.min(...pg.rooms.map(r => r.price)).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-lg flex gap-4 text-[10px] font-bold uppercase tracking-wider">
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2563eb]"></span> Boys</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#db2777]"></span> Girls</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4f46e5]"></span> Mixed</div>
        </div>
      </div>
    </div>
  );
}

export default SmartMap;
