import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

// Noise function for organic liquid movement
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Smooth noise for liquid distortion
float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal noise for complex liquid patterns
float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Flow distortion function
vec2 flowDistortion(vec2 uv, float time) {
    float flowSpeed = uSpeed * 0.3;
    vec2 flow1 = vec2(sin(time * flowSpeed + uv.y * 3.0), cos(time * flowSpeed * 0.8 + uv.x * 2.5)) * 0.1;
    vec2 flow2 = vec2(cos(time * flowSpeed * 1.2 + uv.x * 4.0), sin(time * flowSpeed * 0.6 + uv.y * 3.5)) * 0.05;
    return flow1 + flow2;
}

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  
  // Mouse influence with liquid-like spread
  vec2 mouseInfluence = (uMouse - vec2(0.5)) * uAmplitude * 2.0;
  uv += mouseInfluence * (1.0 + sin(uTime * uSpeed * 0.5) * 0.3);
  
  // Time-based liquid flow
  float time = uTime * uSpeed;
  
  // Apply flow distortion for liquid movement
  vec2 distortedUv = uv + flowDistortion(uv, time);
  
  // Create liquid wave patterns
  float wave1 = sin(distortedUv.x * 4.0 + time * 0.8 + fractalNoise(distortedUv * 2.0 + time * 0.1) * 3.0) * 0.5;
  float wave2 = cos(distortedUv.y * 3.5 + time * 0.6 + fractalNoise(distortedUv * 1.5 + time * 0.15) * 2.5) * 0.3;
  float wave3 = sin((distortedUv.x + distortedUv.y) * 2.8 + time * 1.2 + fractalNoise(distortedUv * 3.0 + time * 0.05) * 4.0) * 0.4;
  
  // Combine waves for liquid surface
  float liquidSurface = wave1 + wave2 + wave3;
  
  // Add turbulence for more organic feel
  float turbulence = fractalNoise(distortedUv * 5.0 + time * 0.2) * 0.3;
  liquidSurface += turbulence;
  
  // Create depth effect with multiple layers
  float depth1 = sin(liquidSurface * 2.0 + time * 0.4) * 0.5 + 0.5;
  float depth2 = cos(liquidSurface * 1.5 + time * 0.7) * 0.3 + 0.7;
  float depth3 = sin(liquidSurface * 3.0 + time * 0.3) * 0.2 + 0.8;
  
  // Liquid color mixing
  vec3 liquidColor1 = vec3(0.2, 0.6, 1.0); // Light blue
  vec3 liquidColor2 = vec3(0.0, 0.3, 0.8); // Deep blue
  vec3 liquidColor3 = vec3(0.1, 0.9, 0.7); // Cyan
  
  // Mix colors based on depth and wave patterns
  vec3 color = mix(liquidColor1, liquidColor2, depth1);
  color = mix(color, liquidColor3, depth2 * 0.5);
  
  // Add highlights and reflections
  float highlight = pow(max(0.0, liquidSurface + 0.3), 3.0) * 0.8;
  color += highlight * vec3(1.0, 1.0, 0.9);
  
  // Apply user color tint
  color *= uColor;
  
  // Add transparency effect for liquid appearance
  float alpha = 0.85 + depth3 * 0.15;
  
  gl_FragColor = vec4(color, alpha);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  ...rest
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    let program: Program;

    function resize() {
      const scale = 1;
      renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseReact) {
        ctn.removeEventListener("mousemove", handleMouseMove);
      }
      ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <div
      ref={ctnDom}
      className="w-full h-full"
      {...rest}
    />
  );
} 