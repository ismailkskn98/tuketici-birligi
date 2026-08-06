"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

const PATHS = [
  {
    gradient: "main",
    delay: 0,
    d: `
      M402.33,663.70
      C395.80,672.17 395.78,672.24 385.33,668.48
      C336.18,650.81 300.09,619.47 283.40,568.91
      C269.29,526.15 277.49,485.99 298.93,446.50
      C305.06,455.64 310.77,465.56 316.67,475.83
      C317.78,477.89 318.28,481.12 317.50,483.23
      C301.14,527.15 312.53,572.88 348.19,604.15
      C355.40,610.47 363.40,615.90 371.86,622.38
      C375.44,614.78 378.56,608.30 381.56,601.75
      L398.31,565.18
      C400.24,561.20 399.46,559.01 396.39,556.17
      C367.03,528.96 341.03,498.90 320.09,465.67
      C302.58,437.04 288.47,407.00 284.40,373.19
      C279.64,333.65 290.42,298.29 315.69,267.99
      C350.40,226.38 395.84,209.93 449.39,214.33
      C479.13,216.77 506.71,226.46 533.53,238.84
      C535.32,239.67 537.06,240.59 538.81,241.51
      C539.48,241.86 540.10,242.33 541.36,243.14
      C533.27,247.17 525.17,250.34 518.03,254.98
      C507.79,261.63 498.56,261.83 486.88,257.39
      C457.25,246.11 426.57,243.64 395.80,253.35
      C337.27,271.82 306.37,333.17 325.12,392.69
      C337.07,430.64 358.03,463.48 383.52,493.31
      C399.74,512.29 418.07,529.51 436.00,546.95
      C441.89,552.68 445.20,558.07 441.87,566.19
      L424.30,604.55
      L402.33,663.70
      Z
    `,
  },

  {
    gradient: "cross",
    delay: 0.08,
    d: `
      M556.65,290.6
      c13.45-5.78,25.32-10.98,37.32-15.89
      c1.23-.5,3.41,.42,4.78,1.27
      c39.42,24.57,76.79,51.87,111.29,83.05
      c25.62,23.15,48.53,48.58,66.18,77.36
      c18.46,31.15,30.4,64.31,26.73,101.22
      c-3.88,38.99-20.53,72.03-50.62,97.18
      c-17.5,14.63-36.88,26.99-55.33,40.49
      c-4.33,3.17-7.08,2.99-9.44-2.31
      c-10-22.49-20.27-44.86-30.34-67.32
      c-6.12-13.66-11.91-27.47-18.18-41.05
      c-1.9-4.11-1.37-6.81,1.93-9.78
      c34.17-30.82,63.52-65.78,89-104.04
      c.29-.44,.79-.74,2.2-2.03
      c5.81,10.95,11.54,21.44,16.84,32.15
      c.64,1.3-.61,4.11-1.76,5.63
      c-19.73,25.88-39.47,51.76-63.12,74.34
      c-1.43,1.37-2.66,4.65-2.01,6.23
      c7.83,18.93,16.03,37.71,24.16,56.52
      c.22,.52,.7,.93,1.41,1.85
      c15.5-10.07,29.46-21.73,40.32-36.83
      c26.98-37.5,25.9-76.85,7.08-117
      c-14.43-30.77-35.69-56.71-60.03-80.05
      c-39.49-37.86-83.81-69.36-130.78-97.24
      c-2.01-1.19-3.97-2.47-7.62-4.76
      Z
    `,
  },

  {
    gradient: "cross",
    delay: 0.16,
    d: `
      M779.55,428.35
      c-8.13-10.8-15.69-20.63-22.9-30.7
      c-.96-1.34-.59-4.05-.1-5.93
      c9.26-35.27,5.1-68.34-17.76-97.46
      c-24.66-31.42-57.51-44.93-97.34-41.06
      c-30.68,2.99-58.21,15.62-85.01,29.43
      c-73.75,37.99-141,85.19-199.78,144.04
      c-1.37,1.37-2.83,2.67-5.12,4.82
      c-4.06-9.59-8.05-18.5-11.45-27.63
      c-.52-1.39,1.29-4.29,2.78-5.69
      c30.29-28.34,62.34-54.51,96.54-78.03
      c42.82-29.43,87.2-56.15,135.11-76.52
      c22.3-9.48,44.79-18.88,69.07-22.03
      c50-6.5,91.26,10.66,122.09,49.79
      c32.17,40.84,36.85,87.2,21.34,136.09
      c-2.19,6.89-4.87,13.62-7.48,20.88
      Z
    `,
  },
];

export function ScrollTopLogo({ className = "", visible = true }) {
  const reduceMotion = useReducedMotion();

  // Bir sayfada birden fazla SVG render edilirse gradient id çakışmasın.
  const id = useId().replace(/:/g, "");

  const mainGradient = `${id}-scroll-top-main`;
  const crossGradient = `${id}-scroll-top-cross`;

  const getGradient = (gradient) => (gradient === "main" ? `url(#${mainGradient})` : `url(#${crossGradient})`);

  const drawVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },

    visible: {
      pathLength: 1,
      opacity: 1,
    },

    hover: {
      pathLength: [0, 1],
      opacity: 1,
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="240 190 600 600"
      className={`${className}`}
      initial={false}
      animate={reduceMotion ? "visible" : visible ? "visible" : "hidden"}
      whileHover={reduceMotion ? undefined : "hover"}
      whileFocus={reduceMotion ? undefined : "hover"}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={mainGradient} x1="276" y1="450" x2="670" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset=".16" stopColor="#870b18" />
          <stop offset=".74" stopColor="#ae0f17" />
        </linearGradient>

        <linearGradient id={crossGradient} x1="340" y1="326" x2="796" y2="326" href={`#${mainGradient}`} />
      </defs>

      {PATHS.map((path, index) => {
        const gradient = getGradient(path.gradient);

        return (
          <g key={index}>
            {/* Asıl logonun hafif görünen dolgusu */}
            <motion.path
              d={path.d}
              fill={gradient}
              initial={false}
              animate={{
                opacity: visible ? 0.18 : 0,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.25,
              }}
            />

            {/* Üzerinden geçen çizim */}
            <motion.path
              d={path.d}
              fill="none"
              stroke={gradient}
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={drawVariants}
              transition={{
                pathLength: {
                  duration: reduceMotion ? 0 : 0.9,
                  delay: reduceMotion ? 0 : path.delay,
                  ease: [0.22, 1, 0.36, 1],
                },

                opacity: {
                  duration: reduceMotion ? 0 : 0.15,
                  delay: reduceMotion ? 0 : path.delay,
                },
              }}
            />
          </g>
        );
      })}

      <motion.path
        d="M475 475 L540 410 L605 475 M540 410 L540 545"
        fill="none"
        stroke={`url(#${mainGradient})`}
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{
          opacity: visible ? 0.95 : 0,
          pathLength: visible ? 1 : 0,
        }}
        whileHover={
          reduceMotion
            ? undefined
            : {
                pathLength: [0, 1],
                opacity: 1,
              }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.5,
          delay: visible ? 0.18 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.svg>
  );
}
