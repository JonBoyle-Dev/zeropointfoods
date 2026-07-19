const RADIUS = 50
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function PointsDial({ pointsLeft, allowance }: { pointsLeft: number; allowance: number }) {
  const fraction = allowance > 0 ? Math.min(1, Math.max(0, pointsLeft / allowance)) : 0
  const dashOffset = CIRCUMFERENCE * (1 - fraction)

  return (
    <div className="relative h-[118px] w-[118px] flex-shrink-0">
      <svg width="118" height="118" viewBox="0 0 118 118" className="-rotate-90">
        <circle cx="59" cy="59" r={RADIUS} fill="none" stroke="#EFF2ED" strokeWidth="12" />
        <circle
          cx="59"
          cy="59"
          r={RADIUS}
          fill="none"
          stroke="#D9A62E"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <b className="font-['Space_Grotesk',sans-serif] text-[30px] leading-none text-[#1C2620]">{Math.round(pointsLeft)}</b>
        <small className="mt-0.5 font-mono text-[10px] text-[#5B665D]">PTS LEFT</small>
      </div>
    </div>
  )
}
