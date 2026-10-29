import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function Mather({ math, display = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: display,
          throwOnError: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
      }
    }
  }, [math, display]);
  return <span ref={containerRef} />;
}