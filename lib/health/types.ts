export type Confidence = 'high' | 'moderate' | 'estimated';
export interface Milestone { hours_after_quitting: number; progress: number; description: string; source: string; confidence: Confidence; }
export interface HealthMetric { id: string; name: string; category: string; description: string; weight: number; disclaimer: string; milestones: Milestone[]; }
export interface UserProfile { cigarettesPerDay: number; packPrice: number; cigarettesPerPack: number; absorptionFactor: number; }
export interface MetricProgress { id: string; name: string; category: string; description: string; progress: number; status: string; nextMilestone: Milestone | null; disclaimer: string; }
export interface HealthSnapshot {
  smokeFreeSeconds: number; smokeFreeHours: number;
  metrics: MetricProgress[]; overall: number;
  nextMilestone: { metricId: string; description: string; atHours: number };
  moneySaved: number; cigarettesAvoided: number;
}
