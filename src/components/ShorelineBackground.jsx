import React from 'react';

export default function ShorelineBackground() {
    return (
        <div className="shoreline-background-container">
            {/* Ambient coast glow in background */}
            <div className="coast-ambient-glow" />
            
            {/* Layered Animated Waves */}
            <div className="wave-layer wave-layer-1">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="grad-wave-1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(130, 34, 255, 0.08)" />
                            <stop offset="100%" stopColor="rgba(130, 34, 255, 0.25)" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#grad-wave-1)" d="M0,96 L48,112 C96,128,192,160,288,181.3 C384,203,480,213,576,192 C672,171,768,117,864,112 C960,107,1056,149,1152,154.7 C1248,160,1344,128,1392,112 L1440,96 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"></path>
                </svg>
            </div>
            
            <div className="wave-layer wave-layer-2">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="grad-wave-2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255, 0, 127, 0.05)" />
                            <stop offset="100%" stopColor="rgba(130, 34, 255, 0.15)" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#grad-wave-2)" d="M0,192 L48,181.3 C96,171,192,149,288,144 C384,139,480,149,576,176 C672,203,768,245,864,245.3 C960,245,1056,203,1152,170.7 C1248,139,1344,117,1392,106.7 L1440,96 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"></path>
                </svg>
            </div>
            
            <div className="wave-layer wave-layer-3">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="grad-wave-3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(0, 240, 255, 0.07)" />
                            <stop offset="100%" stopColor="rgba(130, 34, 255, 0.12)" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#grad-wave-3)" d="M0,224 L48,224 C96,224,192,224,288,208 C384,192,480,160,576,165.3 C672,171,768,213,864,229.3 C960,245,1056,235,1152,202.7 C1248,171,1344,117,1392,90.7 L1440,64 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"></path>
                </svg>
            </div>
            
            <div className="wave-layer wave-layer-4">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="grad-wave-4" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(0, 255, 135, 0.08)" />
                            <stop offset="100%" stopColor="rgba(0, 240, 255, 0.15)" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#grad-wave-4)" d="M0,160 L48,176 C96,192,192,224,288,224 C384,224,480,192,576,181.3 C672,171,768,181,864,192 C960,203,1056,213,1152,192 C1248,171,1344,117,1392,90.7 L1440,64 L1440,320 L1392,320 C1344,320,1248,320,1152,320 C1056,320,960,320,864,320 C768,320,672,320,576,320 C480,320,384,320,288,320 C192,320,96,320,48,320 L0,320 Z"></path>
                </svg>
            </div>
        </div>
    );
}
