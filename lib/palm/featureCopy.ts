// Display labels for FeatureKind values. Used by FeatureHotspot tooltips and
// in any "this section discusses X" copy. Tradition-aware: Indian readings
// use Sanskrit-rooted terms with English alongside; Chinese use the Mandarin
// term + English. Falls back to the English label when tradition is 'unknown'.

import type { FeatureKind } from '@/lib/ai/citationToFeature';

export type ActiveTradition = 'indian' | 'chinese';

interface FeatureLabel {
  /** Short label shown in tooltips. */
  short: string;
  /** Optional one-line subtitle / native term. */
  subtitle?: string;
}

const INDIAN_LABELS: Partial<Record<string, FeatureLabel>> = {
  'mount:jupiter': { short: 'Mount of Guru', subtitle: 'Jupiter' },
  'mount:saturn': { short: 'Mount of Śani', subtitle: 'Saturn' },
  'mount:sun': { short: 'Mount of Sūrya', subtitle: 'Sun' },
  'mount:mercury': { short: 'Mount of Budha', subtitle: 'Mercury' },
  'mount:venus': { short: 'Mount of Śukra', subtitle: 'Venus' },
  'mount:moon': { short: 'Mount of Chandra', subtitle: 'Moon' },
  'mount:mars-upper': { short: 'Maṅgala (upper)', subtitle: 'Mars active' },
  'mount:mars-lower': { short: 'Maṅgala (lower)', subtitle: 'Mars passive' },
  'line:heart': { short: 'Hṛdaya rekhā', subtitle: 'Heart line' },
  'line:head': { short: 'Mastiṣka rekhā', subtitle: 'Head line' },
  'line:life': { short: 'Āyu rekhā', subtitle: 'Life line' },
  'line:fate': { short: 'Bhāgya rekhā', subtitle: 'Fate line' },
  'line:sun': { short: 'Sūrya rekhā', subtitle: 'Sun line' },
  'line:marriage': { short: 'Vivāha rekhā', subtitle: 'Marriage line' },
  'marker:matsya': { short: 'Matsya cihna', subtitle: 'Fish mark' },
  'marker:shankha': { short: 'Śaṅkha cihna', subtitle: 'Conch mark' },
  'marker:trishula': { short: 'Triśūla cihna', subtitle: 'Trident mark' },
  'marker:padma': { short: 'Padma cihna', subtitle: 'Lotus mark' },
  'marker:dhvaja': { short: 'Dhvaja cihna', subtitle: 'Flag mark' },
  'marker:yav': { short: 'Yav cihna', subtitle: 'Barley mark' },
  'marker:mystic-cross': { short: 'Mystic cross', subtitle: 'between heart & head' },
  'marker:temple': { short: 'Temple mark' },
  'finger:thumb': { short: 'Thumb' },
  'finger:index': { short: 'Jupiter finger', subtitle: 'index' },
  'finger:middle': { short: 'Saturn finger', subtitle: 'middle' },
  'finger:ring': { short: 'Sūrya finger', subtitle: 'ring' },
  'finger:pinky': { short: 'Mercury finger', subtitle: 'little' },
  'whole-hand': { short: 'Hand as a whole' },
};

const CHINESE_LABELS: Partial<Record<string, FeatureLabel>> = {
  'mount:jupiter': { short: 'Index zone', subtitle: '木 Wood region' },
  'mount:saturn': { short: 'Middle zone', subtitle: '土 Earth region' },
  'mount:sun': { short: 'Ring zone', subtitle: '火 Fire region' },
  'mount:mercury': { short: 'Little zone', subtitle: '水 Water region' },
  'mount:venus': { short: 'Thumb pad' },
  'mount:moon': { short: 'Percussion' },
  'mount:mars-upper': { short: 'Upper edge' },
  'mount:mars-lower': { short: 'Lower edge' },
  'line:heart': { short: 'Tian wen', subtitle: '天紋 Heaven line' },
  'line:head': { short: 'Ren wen', subtitle: '人紋 Human line' },
  'line:life': { short: 'Di wen', subtitle: '地紋 Earth line' },
  'line:fate': { short: 'Centre line' },
  'line:sun': { short: 'Sun line' },
  'line:marriage': { short: 'Marriage line' },
  'palace:qian': { short: 'Qián 乾', subtitle: 'palace' },
  'palace:kun': { short: 'Kūn 坤', subtitle: 'palace' },
  'palace:kan': { short: 'Kǎn 坎', subtitle: 'palace' },
  'palace:li': { short: 'Lí 離', subtitle: 'palace' },
  'palace:zhen': { short: 'Zhèn 震', subtitle: 'palace' },
  'palace:xun': { short: 'Xùn 巽', subtitle: 'palace' },
  'palace:gen': { short: 'Gèn 艮', subtitle: 'palace' },
  'palace:dui': { short: 'Duì 兌', subtitle: 'palace' },
  'palace:marriage': { short: 'Marriage palace' },
  'whole-hand': { short: 'Hand as a whole' },
};

function featureKey(f: FeatureKind): string {
  if (f.kind === 'whole-hand') return 'whole-hand';
  return `${f.kind}:${f.id}`;
}

const FALLBACK: FeatureLabel = { short: 'Feature' };

export function describeFeature(feature: FeatureKind, tradition: ActiveTradition): FeatureLabel {
  const key = featureKey(feature);
  const table = tradition === 'indian' ? INDIAN_LABELS : CHINESE_LABELS;
  return table[key] ?? FALLBACK;
}
