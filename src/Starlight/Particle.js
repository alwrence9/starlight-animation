// Particle class for stars
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.ctx = this.effect.ctx;
        this.originX = Math.random() * this.effect.width;
        this.originY = Math.random() * this.effect.height;
        this.x = this.originX;
        this.y = this.originY;
        this.baseSize = Math.random() * 2 + 1; // Random size between 1 and 3
        this.size = this.baseSize;
        this.maxSize = this.baseSize * 1.5;
        this.minSize = this.baseSize * 0.5;
        this.pulsateSpeed = 0.03; // Slower pulsate speed
        this.colorPhase = Math.random() * 2 * Math.PI; // Random initial color phase
        this.colorSpeed = Math.random() * 0.02 + 0.01; // Slower speed for each star to mimic breathing
        this.movementSpeed = 0.3; // Slower movement speed to reduce the jiggle effect
        this.vx = 0; // Velocity X
        this.vy = 0; // Velocity Y
        this.friction = 0.92; // Damping effect to smooth out the movement
    }

    getColor() {
        const height = this.effect.height;
        const ratio = this.y / height;
        const gradients = this.effect.gradients;
        let color;

        for (let i = 0; i < gradients.length - 1; i++) {
            const start = gradients[i];
            const end = gradients[i + 1];

            if (ratio >= start.ratio && ratio <= end.ratio) {
                const t = (ratio - start.ratio) / (end.ratio - start.ratio);
                const r = Math.round(start.color[0] + t * (end.color[0] - start.color[0]));
                const g = Math.round(start.color[1] + t * (end.color[1] - start.color[1]));
                const b = Math.round(start.color[2] + t * (end.color[2] - start.color[2]));
                color = { r, g, b };
                break;
            }
        }

        return color;
    }

    draw() {
        if (this.x < 0 || this.x > this.effect.width || this.y < 0 || this.y > this.effect.height) {
            // Skip drawing if the particle is out of bounds
            return;
        }

        const baseColor = this.getColor();
        if (!baseColor) {
            return; // Skip drawing if baseColor is undefined
        }
        const { r, g, b } = baseColor;
        const whiteFactor = Math.sin(this.colorPhase) * 0.5 + 0.5; // Smooth flash effect
        const whiterColor = {
            r: Math.round(r + (255 - r) * whiteFactor),
            g: Math.round(g + (255 - g) * whiteFactor),
            b: Math.round(b + (255 - b) * whiteFactor)
        };
        this.ctx.fillStyle = `rgb(${whiterColor.r},${whiterColor.g},${whiterColor.b})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

        if (this.distance < this.effect.mouse.radius) {
            // Move the particle away from the mouse
            const angle = Math.atan2(this.dy, this.dx);
            this.vx -= Math.cos(angle) * this.movementSpeed;
            this.vy -= Math.sin(angle) * this.movementSpeed;
        } else {
            // Return to original position
            this.vx += (this.originX - this.x) * 0.05;
            this.vy += (this.originY - this.y) * 0.05;
        }

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        if (this.size > this.minSize) {
            this.size -= this.pulsateSpeed;
        }

        this.colorPhase += this.colorSpeed; // Slower flashing speed
        this.draw();
    }
}

export default Particle;