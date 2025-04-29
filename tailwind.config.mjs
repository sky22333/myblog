/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      fontWeight: {
        bold: "700",
      },
      textAlign: {
        left: "left",
      },
      width: {
        full: "100%",
      },
      maxWidth: {
        none: "none",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        full: "100%",
      },
      height: {
        auto: "auto",
      },
      margin: {
        auto: "auto",
        "4": "1rem",
        "6": "1.5rem",
        "8": "2rem",
      },
      padding: {
        "1": "0.25rem",
        "1.5": "0.375rem",
        "2": "0.5rem",
        "4": "1rem",
        "6": "1.5rem",
      },
      borderWidth: {
        DEFAULT: "1px",
        "0": "0",
        "2": "2px",
        "4": "4px",
      },
      listStyleType: {
        disc: "disc",
        decimal: "decimal",
      },
      overflow: {
        auto: "auto",
        hidden: "hidden",
        "x-auto": "auto",
      },
      position: {
        relative: "relative",
        absolute: "absolute",
      },
      inset: {
        "0": "0",
      },
      display: {
        grid: "grid",
      },
      gridTemplateColumns: {
        "1": "repeat(1, minmax(0, 1fr))",
        "2": "repeat(2, minmax(0, 1fr))",
        "3": "repeat(3, minmax(0, 1fr))",
        "4": "repeat(4, minmax(0, 1fr))",
      },
      gap: {
        "6": "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideInFromTop: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        slideInFromBottom: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-out": "fadeOut 0.3s ease-in-out",
        "slide-in-from-top": "slideInFromTop 0.3s ease-in-out",
        "slide-in-from-bottom": "slideInFromBottom 0.3s ease-in-out",
      },
      transitionProperty: {
        all: "all",
        colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
      transitionDuration: {
        "300": "300ms",
      },
      translate: {
        "0": "0",
        "-1": "-0.25rem",
      },
      boxShadow: {
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      backgroundImage: {
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        md: "12px",
      },
      scale: {
        "110": "1.1",
      },
      textWrap: {
        balance: "balance",
      },
      textShadow: {
        DEFAULT: "0 2px 4px rgba(0, 0, 0, 0.1)",
        lg: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      scrollBehavior: {
        smooth: "smooth",
      },
      lineHeight: {
        "7": "1.75rem",
      },
      fontSize: {
        sm: "0.875rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
      fontStyle: {
        italic: "italic",
      },
      textUnderlineOffset: {
        "2": "2px",
      },
      opacity: {
        "0": "0",
        "40": "0.4",
        "60": "0.6",
        "80": "0.8",
        "100": "1",
      },
      zIndex: {
        "50": "50",
      },
      scrollMargin: {
        "20": "5rem",
      },
      tracking: {
        tight: "-0.025em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    'font-bold',
    'text-left',
    'w-full',
    'max-w-none',
    'h-auto',
    'mx-auto',
    'my-4',
    'my-6',
    'mt-6',
    'mb-4',
    'border-b',
    'border-l-4',
    'list-disc',
    'list-decimal',
    'rounded',
    'rounded-lg',
    'transition-all',
    'transition-colors',
    'duration-300',
    'opacity-0',
    'opacity-100',
    'line-clamp-1',
    'line-clamp-2',
    'will-change-transform',
    'transform-gpu',
    'text-balance',
    'text-sm',
    'shadow-md',
  ],
};
