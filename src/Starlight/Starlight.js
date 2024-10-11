import React, { useRef, useEffect } from 'react';
import { createNoise2D } from 'simplex-noise';
import Particle from "./Particle";

const Starlight = () => {
    const canvasRef = useRef(null);
    const noise2D = createNoise2D();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;


        class Effect {
            constructor(width, height, context) {
                this.width = width;
                this.height = height;
                this.ctx = context;
                this.particlesArray = [];
                this.gap = 20;
                this.mouse = {
                    radius: 100,
                    x: 0,
                    y: 0
                };

                this.gradients = [
                    { ratio: 0, color: [75, 0, 130] },      // Indigo
                    { ratio: 0.3, color: [0, 0, 139] },     // Dark Blue
                    { ratio: 0.6, color: [0, 191, 255] },   // Deep Sky Blue
                    { ratio: 1, color: [224, 255, 255] }    // Light Cyan
                ];

                window.addEventListener('mousemove', this.handleMouseMove);
                window.addEventListener('resize', this.handleResize);

                this.init();
            }

            handleMouseMove = (e) => {
                this.mouse.x = e.clientX * window.devicePixelRatio;
                this.mouse.y = e.pageY * window.devicePixelRatio;
            }

            handleResize = () => {
                canvas.width = window.innerWidth * window.devicePixelRatio;
                canvas.height = window.innerHeight * window.devicePixelRatio;
                this.width = canvas.width;
                this.height = canvas.height;
                canvas.style.width = `${window.innerWidth}px`;
                canvas.style.height = `${window.innerHeight}px`;

                this.particlesArray = [];
                this.init();
            }

            init() {
                for (let i = 0; i < 1000; i++) { // More stars
                    this.particlesArray.push(new Particle(this));
                }
            }

            update() {
                this.ctx.clearRect(0, 0, this.width, this.height);
                for (let i = 0; i < this.particlesArray.length; i++) {
                    this.particlesArray[i].update();
                }
            }
        }

        const effect = new Effect(canvas.width, canvas.height, ctx);
        const animate = () => {
            effect.update();
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', effect.handleMouseMove);
            window.removeEventListener('resize', effect.handleResize);
        };
    }, []);

    return <canvas ref={canvasRef}></canvas>;
};

export default Starlight;
