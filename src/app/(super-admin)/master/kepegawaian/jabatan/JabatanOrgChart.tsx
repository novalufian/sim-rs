"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { useJabatanHierarchy } from "@/hooks/fetch/master/useJabatanHierarchy";

export default function JabatanOrgChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { treeData, isLoading } = useJabatanHierarchy();

  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    const handleResize = () => {
      setDimensions({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };
    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const translate = useMemo(() => {
    return {
      x: dimensions.width / 2,
      y: 80,
    };
  }, [dimensions]);

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Memuat struktur jabatan...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Struktur Jabatan</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Visualisasi hierarki jabatan.</p>
      </div>
      <div ref={containerRef} className="w-full h-[520px]">
        {dimensions.width > 0 && (
          <Tree
            data={treeData as any}
            translate={translate}
            orientation="vertical"
            collapsible={false}
            transitionDuration={0}
            pathFunc="elbow"
            renderCustomNodeElement={({ nodeDatum }: any) => (
              <g>
                <rect
                  x={-110}
                  y={-40}
                  width={220}
                  height={70}
                  rx={10}
                  ry={10}
                  fill="white"
                  stroke="#E5E7EB"
                />
                <text x={0} y={-12} textAnchor="middle" className="fill-gray-900 text-[12px]">
                  {nodeDatum.name}
                </text>
                <text x={0} y={10} textAnchor="middle" className="fill-gray-500 text-[10px]">
                  {nodeDatum.attributes?.tipe || "-"}
                </text>
              </g>
            )}
          />
        )}
      </div>
    </div>
  );
}
