import React from 'react';

interface CscaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CscaLogo: React.FC<CscaLogoProps> = ({ className = '', size = 'md' }) => {
  const dimension = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${dimension} ${className}`}>
      {/* Official CSC Emblem SVG with stylized swirling ribbon / scholar crest */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="cscaGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id="cscaSwirlA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="cscaSwirlB" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="cscaGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Outer Circular Seal Badge */}
        <circle cx="50" cy="50" r="47" stroke="url(#cscaGradientRing)" strokeWidth="2.5" fill="#0b1e36" />
        <circle cx="50" cy="50" r="43" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.8" />

        {/* Inner subtle glow ring */}
        <circle cx="50" cy="50" r="39" fill="url(#cscaGradientRing)" opacity="0.12" />

        {/* Dynamic Stylized CSC Swirling Ribbon / Wing Motif (matching official China Scholarship Council watermark) */}
        {/* Upper Sweeping Wing */}
        <path
          d="M 50 16 
             C 66 16, 78 27, 78 41 
             C 78 54, 67 61, 56 63 
             C 45 65, 36 60, 31 54 
             C 27 49, 29 44, 34 43 
             C 39 42, 44 46, 50 48 
             C 58 50, 66 46, 66 38 
             C 66 29, 57 23, 47 24 
             C 38 25, 32 30, 28 35 
             L 24 30 
             C 30 22, 39 16, 50 16 Z"
          fill="url(#cscaSwirlA)"
        />

        {/* Lower Counter-Sweeping Ribbon */}
        <path
          d="M 50 84 
             C 34 84, 22 73, 22 59 
             C 22 46, 33 39, 44 37 
             C 55 35, 64 40, 69 46 
             C 73 51, 71 56, 66 57 
             C 61 58, 56 54, 50 52 
             C 42 50, 34 54, 34 62 
             C 34 71, 43 77, 53 76 
             C 62 75, 68 70, 72 65 
             L 76 70 
             C 70 78, 61 84, 50 84 Z"
          fill="url(#cscaSwirlB)"
        />

        {/* Center Golden Academic Sparkle / Star Core */}
        <polygon
          points="50,42 52.5,47.5 58,50 52.5,52.5 50,58 47.5,52.5 42,50 47.5,47.5"
          fill="url(#cscaGoldAccent)"
        />

        {/* Micro-stars on the perimeter */}
        <circle cx="21" cy="50" r="1.5" fill="#facc15" />
        <circle cx="79" cy="50" r="1.5" fill="#facc15" />
      </svg>
    </div>
  );
};
