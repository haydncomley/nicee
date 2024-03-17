export function shiftHue(rgb: string, angle: number): string {
    // Remove # if present
    let [r, g, b] = rgb.split(',').map((c) => parseInt(c.trim()));

    // Convert RGB to HSL
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h: number;
    let s: number;
    let l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h! /= 6;
    }

    // Shift hue
    h = (h! + angle) % 1;
    if (h < 0) h += 1;

    // Convert HSL back to RGB
    let hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);

    return `${r}, ${g}, ${b}`;
}

export function hexToRgb(hex: string): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    // Convert to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r}, ${g}, ${b}`;
}

export function deterministicRandom(seed: number, min: number, max: number): number {
    const random = (): number => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const randomInt = (min: number, max: number): number => {
        return Math.floor(random() * (max - min + 1) + min);
    };

    return randomInt(min, max);
}

export function rgbToHex(rgb: string): string {
    const [r, g, b] = rgb.split(',').map((c) => parseInt(c.trim()));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
