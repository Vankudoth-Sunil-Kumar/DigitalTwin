import React, { useEffect, useState } from 'react';
import { HeroDemoStep, ViewMode } from '../types';
import { heroDemoSteps } from '../data/heroDemoScript';

interface HeroDemoControllerProps {
  currentStepIndex: number;
  isPlaying: boolean;
  onSelectStep: (stepIndex: number) => void;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onNavigateView?: (view: ViewMode) => void;
  onClose?: () => void;
}

export const HeroDemoController: React.FC<HeroDemoControllerProps> = ({
  currentStepIndex,
  isPlaying,
  onSelectStep,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onNavigateView,
  onClose
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const currentStep = heroDemoSteps[currentStepIndex] || heroDemoSteps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = (currentStepIndex === heroDemoSteps.length - 1 ? 4000 : 3500) / playbackSpeed;
      timer = setTimeout(() => {
        if (currentStepIndex < heroDemoSteps.length - 1) {
          onNextStep();
        } else {
          onTogglePlay(); // stop at end
        }
      }, intervalMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, playbackSpeed, onNextStep, onTogglePlay]);

  return (
    <div
      id="hero-demo-controller"
      className="bg-[#0b1329] border-b border-[#2170e4]/40 text-white px-4 py-2.5 shadow-xl relative z-40 font-sans"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Badge & Live Story Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 bg-[#2170e4]/30 border border-[#2170e4] px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#90caf9] uppercase">
              TRACK 4 JUDGE DEMO
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-[#F59E0B] bg-[#F59E0B]/20 px-1.5 py-0.5 rounded">
                {currentStep.timeLabel} ({currentStep.clockTime})
              </span>
              <span className="text-[13px] font-bold text-white truncate">
                Step {currentStep.stepIndex + 1}/10: {currentStep.title}
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] truncate max-w-xl">
              {currentStep.explanationText}
            </p>
          </div>
        </div>

        {/* Center: Step Scrubber Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {heroDemoSteps.map((step) => {
            const isCurrent = step.stepIndex === currentStepIndex;
            const isPast = step.stepIndex < currentStepIndex;
            return (
              <button
                key={step.stepIndex}
                onClick={() => onSelectStep(step.stepIndex)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2170e4] text-white font-bold shadow-md scale-105 ring-1 ring-white/50'
                    : isPast
                    ? 'bg-white/10 text-[#cbd5e1] hover:bg-white/20'
                    : 'bg-white/5 text-[#64748b] hover:bg-white/10'
                }`}
                title={`${step.timeLabel} - ${step.title}`}
              >
                <span>{step.timeLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Media Controls & Jump to Recommended View */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-white/10 rounded p-0.5 border border-white/10">
            <button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className="p-1 text-[#cbd5e1] hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Step"
            >
              <span className="material-symbols-outlined text-[18px]">skip_previous</span>
            </button>
            <button
              onClick={onTogglePlay}
              className="px-2.5 py-1 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
            </button>
            <button
              onClick={onNextStep}
              disabled={currentStepIndex === heroDemoSteps.length - 1}
              className="p-1 text-[#cbd5e1] hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Step"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
            </button>
            <button
              onClick={onReset}
              className="p-1 text-[#cbd5e1] hover:text-white cursor-pointer"
              title="Reset to 00:00"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 3 : 1)}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded text-[10px] font-mono font-bold cursor-pointer"
            title="Toggle playback speed"
          >
            {playbackSpeed}x SPD
          </button>

          {/* Jump to View Button */}
          {onNavigateView && (
            <button
              onClick={() => onNavigateView(currentStep.viewRecommendation)}
              className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/40 border border-[#10B981] text-[#6ee7b7] rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View {currentStep.viewRecommendation.toUpperCase()}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-[#64748b] hover:text-white cursor-pointer ml-1"
              title="Exit Judge Demo mode"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
