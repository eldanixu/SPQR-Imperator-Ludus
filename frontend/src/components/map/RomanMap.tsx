import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axiosInstance from '../../api/axiosInstance';
import { FeatureCollection } from 'geojson';
import { useGameStore } from '../../store/useGameStore';

interface Provincia {
  id: number;
  nombre: string;
  nombreLatino: string;
  descripcion: string;
  capital: string;
  regionSvgId: string;
}

interface RomanMapProps {
  selectedRegionId?: string | null;
  onProvinciaClick?: (regionSvgId: string) => void;
}

const mapNameToRegionId = (name: string): string | null => {
  if (!name) return null;
  const n = name.toLowerCase();
  
  if (['tarraconensis', 'baetica', 'lusitania'].includes(n)) return 'hispania';
  if (['lugdunensis', 'belgica', 'aquitania', 'narbonensis', 'alpes graiae et poeninae', 'alpes cottiae', 'alpes maritimae'].includes(n)) return 'gallia';
  if (['xi', 'ix', 'x', 'viii', 'vii', 'vi', 'iv', 'v', 'i', 'ii', 'iii', 'sicilia', 'sardinia et corsica'].includes(n)) return 'italia';
  if (['britannia'].includes(n)) return 'britannia';
  if (['aegyptus'].includes(n)) return 'aegyptus';
  
  if (['hispania', 'gallia', 'italia', 'britannia', 'aegyptus'].includes(n)) return n;
  
  return null;
};

export default function RomanMap({ selectedRegionId, onProvinciaClick }: RomanMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const onClickRef = useRef(onProvinciaClick);
  const [provincias, setProvincias] = useState<Provincia[]>([]);

  const { provinciaActualId, modoJuego, provinciasVisitadas } = useGameStore();

  // Refs para usar valores frescos en callbacks d3
  const provinciasVisitadasRef = useRef(provinciasVisitadas);
  const modoJuegoRef = useRef(modoJuego);

  useEffect(() => {
    onClickRef.current = onProvinciaClick;
  }, [onProvinciaClick]);

  useEffect(() => {
    provinciasVisitadasRef.current = provinciasVisitadas;
  }, [provinciasVisitadas]);

  useEffect(() => {
    modoJuegoRef.current = modoJuego;
  }, [modoJuego]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [geoRes, apiRes] = await Promise.all([
          d3.json<FeatureCollection>('/roman_empire.geojson'),
          axiosInstance.get('/provincias'),
        ]);

        if (!isMounted) return;

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

  const getRegionId = (d: any) => {
    const props = d.properties || {};
    const id = props.id?.toString();
    const name = props.name?.toString();
    
    // Logueo solicitado:
    if (id || name) {
      console.log(`Feature properties -> id: ${id}, name: ${name}`);
    }

    return mapNameToRegionId(id) || mapNameToRegionId(name);
  };

  const selectedRegionRef = useRef(selectedRegionId);

  // Helper para calcular el color de fill de una región
  const getFillColor = (regionId: string | null): string => {
    if (!regionId) return '#3d2b1f';
    if (regionId === selectedRegionRef.current) return '#C9A84C';
    if (modoJuegoRef.current && provinciasVisitadasRef.current.has(regionId)) return '#C0392B';
    return '#8B1a1a';
  };

  const getStrokeColor = (regionId: string | null): string => {
    if (!regionId) return '#5a3e28';
    if (regionId === selectedRegionRef.current) return '#fff';
    if (modoJuegoRef.current && provinciasVisitadasRef.current.has(regionId)) return '#fff';
    return '#C9A84C';
  };

  const getStrokeWidth = (regionId: string | null): number => {
    if (!regionId) return 0.5;
    if (regionId === selectedRegionRef.current) return 1.5;
    if (modoJuegoRef.current && provinciasVisitadasRef.current.has(regionId)) return 1.2;
    return 1;
  };

  useEffect(() => {
    selectedRegionRef.current = selectedRegionId;
    if (selectedRegionId === null) {
      const svg = d3.select(svgRef.current);
      const mapGroup = svg.select('g.map-group');
      if (mapGroup && !mapGroup.empty()) {
        mapGroup.selectAll('path')
          .filter((pathD: any) => !!getRegionId(pathD))
          .attr('fill', (d: any) => {
            const regionId = getRegionId(d);
            return getFillColor(regionId);
          })
          .attr('stroke', (d: any) => {
            const regionId = getRegionId(d);
            return getStrokeColor(regionId);
          })
          .attr('stroke-width', (d: any) => {
            const regionId = getRegionId(d);
            return getStrokeWidth(regionId);
          });
      }
    }
  }, [selectedRegionId]);

  // Redibujar colores cuando cambia el estado del juego o las provincias visitadas
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const mapGroup = svg.select('g.map-group');
    if (mapGroup && !mapGroup.empty()) {
      mapGroup.selectAll('path')
        .filter((pathD: any) => !!getRegionId(pathD))
        .attr('fill', (d: any) => {
          const regionId = getRegionId(d);
          return getFillColor(regionId);
        })
        .attr('stroke', (d: any) => {
          const regionId = getRegionId(d);
          return getStrokeColor(regionId);
        })
        .attr('stroke-width', (d: any) => {
          const regionId = getRegionId(d);
          return getStrokeWidth(regionId);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinciaActualId, modoJuego, provinciasVisitadas]);

  const drawMap = (geoData: FeatureCollection, provData: Provincia[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 960;
    const height = 600;

    const projection = d3.geoNaturalEarth1()
      .center([20, 38])
      .scale(800)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const mapGroup = svg.append('g').attr('class', 'map-group');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        mapGroup.attr('transform', event.transform);
      });

    svg.call(zoom);
    svg.on("dblclick.zoom", null);
    svg.on("dblclick", () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });

    mapGroup.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', (d) => pathGenerator(d as any))
      .attr('fill', (d) => {
        const regionId = getRegionId(d);
        return getFillColor(regionId);
      })
      .attr('stroke', (d) => {
        const regionId = getRegionId(d);
        return getStrokeColor(regionId);
      })
      .attr('stroke-width', (d) => {
        const regionId = getRegionId(d);
        return getStrokeWidth(regionId);
      })
      .style('cursor', (d) => getRegionId(d) ? 'pointer' : 'default')
      .on('mouseenter', function(_event, d) {
        const regionId = getRegionId(d);
        if (!regionId) return;
        if (regionId !== selectedRegionRef.current) {
          d3.select(this).attr('fill', '#C9A84C');
        }
      })
      .on('mouseleave', function(_event, d) {
        const regionId = getRegionId(d);
        if (!regionId) return;
        if (regionId !== selectedRegionRef.current) {
          d3.select(this).attr('fill', getFillColor(regionId));
        }
      })
      .on('click', function(_event, d) {
        const regionId = getRegionId(d);
        if (!regionId) return;
        selectedRegionRef.current = regionId;
        d3.select(this)
          .attr('fill', '#C9A84C')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
        if (onClickRef.current) {
          onClickRef.current(regionId);
        }
      });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#0d2137' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 960 600"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      />
      
      {/* Leyenda */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        border: '1px solid #C9A84C33',
        padding: '12px',
        fontFamily: "'Cinzel', serif",
        fontSize: '11px',
        color: '#8a7a5a',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#8B1a1a', display: 'inline-block', borderRadius: '50%' }}></span>
          <span>Provincia activa</span>
        </div>
        {modoJuego && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#C0392B', display: 'inline-block', borderRadius: '50%', border: '1px solid #fff' }}></span>
            <span>Ya visitada</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#C9A84C', display: 'inline-block', borderRadius: '50%' }}></span>
          <span>Seleccionada</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#3d2b1f', display: 'inline-block', border: '1px solid #5a3e28' }}></span>
          <span>Sin datos</span>
        </div>
      </div>
    </div>
  );
}
