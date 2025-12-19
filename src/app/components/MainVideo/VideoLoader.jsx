"use client";
import React, { useRef } from "react";

export default function VideoLoader({ onFinished, isVisible }) {
    const videoRef = useRef(null);

    // Agar video khatam ho chuki hai toh component render mat karo
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                muted
                onEnded={onFinished}
                playsInline
                className="w-full h-full object-fill bg-transparent" // object-cover se object-fill kar diya
            >
                <source src="/video/door.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}