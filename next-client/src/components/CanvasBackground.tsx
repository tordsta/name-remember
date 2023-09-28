import React, { useRef, useEffect } from "react";

const CanvasBackground = ({
  width,
  height,
  style = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
}: {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
      } else {
        canvas.width = window.outerWidth;
        canvas.height = window.outerHeight;
      }
      drawBackground(ctx, canvas.width, canvas.height);
    };

    const drawBackground = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      const lineSpacing = 10;
      const lineAngle = 3; //Higher number equals more vertical lines
      const maxRand = Math.floor(lineSpacing * 1);
      for (let i = 0; i < 200; i++) {
        let randEnd = Math.floor(Math.random() * maxRand);
        let randStart = Math.floor(Math.random() * maxRand);
        ctx.beginPath();
        ctx.strokeStyle = "#e5e5e5";
        ctx.moveTo(i * lineSpacing + randStart, 0);
        ctx.lineTo(-width / lineAngle + i * lineSpacing + randEnd, height);
        ctx.stroke();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [height, width]);

  return <canvas ref={canvasRef} style={style} />;
};

export default CanvasBackground;
