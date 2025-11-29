export type InsightCategory = {
  id: string;
  title: string;
  routeName: string;
};

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  {
    id: 'themes',
    title: 'Themes You Marked as Important',
    routeName: 'insight-themes',
  },
  {
    id: 'moments',
    title: 'Meaningful Moments & Emotional Patterns',
    routeName: 'insight-moments',
  },
  {
    id: 'problems',
    title: 'Core Problems & Unsolved Threads',
    routeName: 'insight-problems',
  },
  {
    id: 'progress',
    title: 'Progress, Competence & Growth',
    routeName: 'insight-progress',
  },
  {
    id: 'deprioritized',
    title: 'Things You Deprioritized or Let Go Of',
    routeName: 'insight-deprioritized',
  },
];
