import React from 'react';

const IntegraTextilLogo = ({ className = "", style = {} }) => {
    return (
        <svg
            viewBox="0 0 800 280"
            className={className}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Globe Icon */}
            <g transform="translate(20, 20)">
                {/* Outer circle */}
                <circle cx="120" cy="120" r="115" fill="#1e3a5f" />

                {/* Teal sections */}
                <path d="M 120 5 A 115 115 0 0 1 235 120 L 120 120 Z" fill="#14b8a6" />
                <path d="M 120 235 A 115 115 0 0 1 5 120 L 120 120 Z" fill="#14b8a6" />

                {/* Cross lines */}
                <rect x="115" y="5" width="10" height="230" fill="#1e3a5f" />
                <rect x="5" y="115" width="230" height="10" fill="#1e3a5f" />

                {/* Curved segments */}
                <path d="M 120 5 Q 180 60 235 120" stroke="#1e3a5f" strokeWidth="10" fill="none" />
                <path d="M 5 120 Q 60 180 120 235" stroke="#1e3a5f" strokeWidth="10" fill="none" />
            </g>

            {/* IntegraTextil Text */}
            <text x="280" y="120" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" fill="#14b8a6">
                IntegraTextil
            </text>

            {/* Orange line */}
            <line x1="280" y1="145" x2="720" y2="145" stroke="#ff6b35" strokeWidth="6" />

            {/* ERP Text */}
            <text x="730" y="120" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#ff6b35">
                ERP
            </text>

            {/* Tagline */}
            <text x="280" y="190" fontFamily="Arial, sans-serif" fontSize="32" fill="#6b7280">
                Software serve clothing
            </text>
        </svg>
    );
};

export default IntegraTextilLogo;
