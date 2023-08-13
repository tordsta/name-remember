import React, { useRef, useEffect } from "react";

const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground(ctx, canvas.width, canvas.height);
    };

    const drawBackground = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = "gray";
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default CanvasBackground;
