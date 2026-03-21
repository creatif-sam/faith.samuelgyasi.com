"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  eventDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function Countdown({ eventDate }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(eventDate)
  );

  useEffect(() => {
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining(eventDate));

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(eventDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  // Don't show countdown if event has passed
  if (timeRemaining.isExpired) {
    return null;
  }

  return (
    <div className="up-countdown">
      <div className="up-countdown-label">Event Starts In</div>
      <div className="up-countdown-grid">
        <div className="up-countdown-unit">
          <div className="up-countdown-value">{String(timeRemaining.days).padStart(2, "0")}</div>
          <div className="up-countdown-name">Days</div>
        </div>
        <div className="up-countdown-unit">
          <div className="up-countdown-value">{String(timeRemaining.hours).padStart(2, "0")}</div>
          <div className="up-countdown-name">Hours</div>
        </div>
        <div className="up-countdown-unit">
          <div className="up-countdown-value">{String(timeRemaining.minutes).padStart(2, "0")}</div>
          <div className="up-countdown-name">Minutes</div>
        </div>
        <div className="up-countdown-unit">
          <div className="up-countdown-value">{String(timeRemaining.seconds).padStart(2, "0")}</div>
          <div className="up-countdown-name">Seconds</div>
        </div>
      </div>
    </div>
  );
}
