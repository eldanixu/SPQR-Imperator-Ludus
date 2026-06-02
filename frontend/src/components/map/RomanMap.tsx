import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axiosInstance from '../../api/axiosInstance';
import { FeatureCollection, Feature, Geometry } from 'geojson';

interface Provincia {
  id: number;
  nombre: string;
  nombreLatino: string;
  descripcion: string;
  capital: string;
  regionSvgId: string;
}

interface RomanMapProps {
  onProvinciaClick?: (regionSvgId: string) => void;
}

export default function RomanMap({ onProvinciaClick }: RomanMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [geoRes, apiRes] = await Promise.all([
          d3.json<FeatureCollection>('/roman_empire.geojson'),
          axiosInstance.get('/api/v1/provincias'),
        ]);

        if (!isMounted) return;

        // Extract provinces from standard ApiResponse structure
        const provData: Provincia[] = apiRes.data.data || apiRes.data;
        setProvincias(provData);

        if (geoRes && svgRef.current) {
          drawMap(geoRes, provData);
        }
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawMap = (geoData: FeatureCollection, provData: Provincia[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 960;
    const height = 500;

    const projection = d3.geoMercator()
      .center([15, 42])
      .scale(800)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const mapGroup = svg.append('g');

    // Create a map of backend data by regionSvgId for fast lookup
    const provMap = new Map<string, Provincia>();
    provData.forEach(p => provMap.set(p.regionSvgId, p));

    mapGroup.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', (d) => pathGenerator(d as any))
      .attr('fill', (d) => {
        const id = d.properties?.id;
        return provMap.has(id) ? '#8B6914' : '#555555';
      })
      .attr('stroke', '#C9A84C33')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function() {
        d3.select(this).attr('fill', '#C9A84C');
      })
      .on('mouseleave', function(event, d) {
        const id = (d as Feature).properties?.id;
        d3.select(this).attr('fill', provMap.has(id) ? '#8B6914' : '#555555');
      })
      .on('click', (event, d) => {
        const id = (d as Feature).properties?.id;
        const prov = provMap.get(id);
        
        if (onProvinciaClick) {
          onProvinciaClick(id);
        } else if (prov) {
          setSelectedProvincia(prov);
        } else {
          setSelectedProvincia(null);
        }
      });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1a3a5c' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 960 500"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      />
      
      {/* Panel lateral interno si no hay onProvinciaClick y hay una seleccionada */}
      {!onProvinciaClick && selectedProvincia && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '250px',
          backgroundColor: '#2C2518',
          border: '1px solid #C9A84C',
          padding: '16px',
          color: '#e6ded4',
          fontFamily: "'Cinzel', serif",
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          borderRadius: '4px'
        }}>
          <button 
            onClick={() => setSelectedProvincia(null)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              color: '#C9A84C',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <h3 style={{ color: '#C9A84C', marginTop: 0, borderBottom: '1px solid #C9A84C33', paddingBottom: '8px' }}>
            {selectedProvincia.nombre}
          </h3>
          <p style={{ fontStyle: 'italic', fontSize: '0.9em', color: '#aaa' }}>{selectedProvincia.nombreLatino}</p>
          <p style={{ fontSize: '0.9em', lineHeight: 1.4 }}>{selectedProvincia.descripcion}</p>
        </div>
      )}
    </div>
  );
}
