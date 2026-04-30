// Per-sub-style metadata distilled from /docs/research.md.
// Updated only via /prompt-update workflow + eval re-run.
//
// Each entry carries: native tradition name, canonical sources (short list),
// glossary excerpts, sub-style-specific disallowed extensions, and the
// karmic_supported flag. The promptAssembler composes these into the
// report_render system prompt at request time.

import type { SubStyleId } from '@/lib/validation/inputSchemas';

export type KarmicSupported = 'yes' | 'no' | 'partial';

export interface TraditionMeta {
  tradition: 'indian' | 'chinese';
  traditionNameNative: string;
  subStyleLabel: string;
  scope: string;
  canonicalSources: string[];
  legitimateMarkers: string;
  glossary: string;
  disallowedExtensions: string[];
  karmicSupported: KarmicSupported;
  toneExamples: string;
}

const INDIAN_VOICE = `From classical translations of Hasta Sāmudrika lineage (Sen, 1960):
- "Straight fingers indicate a fortunate person." (declarative; condition → conclusion)
- "If the little finger is nearly as long as the third, it is the mark of a savant and philosopher."
- "Under the influence of a strong will the lines of the palm undergo changes corresponding to the altered life of the person." (agency-preserving)
- "When [the conch mark] is present, it denotes a millionaire." (sign → significance, compact)`;

const CHINESE_VOICE = `From Chen Tuan / Má Yī lineage (Kohn, 1986):
- "The heart is the root of countenance, so by examining the heart one's morality is clear; deeds are the appearance of the heart, so by examining deeds one's luck is clear." (parallel clauses, ethical-cosmological)
- Bīng Jiàn structural pattern: "Look first at the spirit and bone; the flesh is secondary. The eye is master; the rest serves." (rank-ordered observation, master-and-servant grammar)`;

const SHARED_DISALLOWED = [
  'no exact dates of death (Sen 1960 explicit prohibition)',
  'no specific tragedy predictions (no granular event predictions)',
  'no specific medical diagnoses (constitutional tendency only)',
  'no lottery / gambling outcome predictions',
  'no past-life identity ("you were [proper noun]")',
  'no cross-tradition blending (Mount of Jupiter ≠ Qián palace; never substitute)',
  'no New Age compounds ("soulmate", "twin flame", "starseed", "lightworker")',
  'no Cheiro / Western pop-palmistry repackaged as Indian',
  'no claim that lines are completely fixed (both traditions preserve agency)',
  'no claim that lines are completely free (both traditions affirm inherited tendency)',
  'no tarot-style scenario predictions',
  'no exact-age-with-single-year-precision events',
  'no pseudepigraphal source citation without "tradition attributes…" hedge',
  'no health claims that cross from constitutional tendency into diagnosis or treatment',
  'no reading children under ~12 with adult-life specificity',
  "no claims that contradict the active sub-style's research.md core-claims block",
];

export const TRADITIONS: Record<SubStyleId, TraditionMeta> = {
  'INDIAN.SAMUDRIKA_COMPREHENSIVE': {
    tradition: 'indian',
    traditionNameNative: 'Sāmudrika Śāstra',
    subStyleLabel: 'Comprehensive Sāmudrika',
    scope:
      "The broadest Indian reading style. Observes the entire hand and contextualizes within whole-body Sāmudrika. Closest sub-style to Varāhamihira's encyclopedic approach.",
    canonicalSources: [
      'Varāhamihira, Bṛhat Saṃhitā, ca. 6th c. CE — chapters 51, 68, 70',
      'Durlabharāja & Jagaddeva, Sāmudrika-tilaka, ca. 1160 CE',
      'Sen, K. C., Hast Samudrika Shastra: The Indian Science of Hand Reading, 1960',
    ],
    legitimateMarkers:
      'Hand as one of many bodily signs; karmic inheritance encoded in markers; auspicious symbols (cihna): matsya/fish, śaṅkha/conch, triśūla/trident, padma/lotus, dhvaja/flag, yav/barley; Manu-smṛti destiny doctrine reframed as tendency-not-fatalism.',
    glossary:
      'Use Sanskrit-rooted vocabulary: Hṛdaya rekhā (Heart line), Mastiṣka rekhā (Head line), Āyu rekhā (Life line), Bhāgya rekhā (Fate line), Sūrya rekhā (Sun line), Vivāha rekhā (marriage line), Mount of Guru (Jupiter), Mount of Śani (Saturn), Mount of Sūrya (Sun), Mount of Budha (Mercury), Mount of Śukra (Venus), Mount of Chandra (Moon), Mars upper/lower. Translate to English alongside on first use.',
    disallowedExtensions: [
      ...SHARED_DISALLOWED,
      'do not name a specific past-life identity (karmic tendency only)',
      'do not predict exact lifespan',
      'do not interpret a hand sign as overriding obvious whole-body or astrological evidence',
    ],
    karmicSupported: 'yes',
    toneExamples: INDIAN_VOICE,
  },
  'INDIAN.HASTA_REKHA': {
    tradition: 'indian',
    traditionNameNative: 'Hasta-Rekhā',
    subStyleLabel: 'Hasta-Rekhā (line-focused)',
    scope:
      'Line-focused Indian sub-style. Emphasizes rekhā (lines) above other features. Rooted in the planetary framework of Jyotiṣa, NOT Western astrology.',
    canonicalSources: [
      'Hasta-Sañjīvanī, attributed to Meghavijayagaṇi (Jaina lineage, late 17th c.)',
      'Sen, K. C., Hast Samudrika Shastra, 1960 — line-focused exposition',
      'Mason, A., Vedic Palmistry: Hastā Rekhā Śāstra, 2017',
    ],
    legitimateMarkers:
      'Pradhāna (primary lines), Aṃśa (secondary lines), Prakīrṇa (miscellaneous lines). Specific named lines: Āyu, Mastiṣka/Buddhi, Hṛdaya, Bhāgya, Sūrya, Vivāha, Santāna.',
    glossary:
      'Use Sanskrit line nomenclature: Āyu rekhā (life), Hṛdaya rekhā (heart), Mastiṣka rekhā (head), Bhāgya rekhā (fate), Sūrya rekhā (sun), Vivāha rekhā (marriage), Santāna rekhā (children).',
    disallowedExtensions: [
      ...SHARED_DISALLOWED,
      'line meanings must trace to the Sanskrit / Jaina lineage record, not Cheiro',
    ],
    karmicSupported: 'yes',
    toneExamples: INDIAN_VOICE,
  },
  'INDIAN.MOUNT_PLANETARY': {
    tradition: 'indian',
    traditionNameNative: 'Sāmudrika — Graha Parvata',
    subStyleLabel: 'Mount-based / planetary',
    scope:
      'Indian sub-style emphasizing the nine planetary mounts (graha parvata) and their kārakatva (innate significations). Reads the hand as a planetary chart.',
    canonicalSources: [
      'Bṛhat Saṃhitā chapter on planetary kārakatva',
      'Sen, K. C., Hast Samudrika Shastra, 1960 — mount sections',
      'Mason, A., Vedic Palmistry, 2017',
    ],
    legitimateMarkers:
      'Nine mounts: Guru (Jupiter), Śani (Saturn), Sūrya (Sun), Budha (Mercury), Śukra (Venus), Chandra (Moon), Mars upper, Mars lower, plus Rāhu/Ketu by context.',
    glossary:
      "Mount terminology in Sanskrit alongside English. Each mount's reading reflects its planet's kārakatva (innate qualities) per Jyotiṣa.",
    disallowedExtensions: [
      ...SHARED_DISALLOWED,
      'Rāhu/Ketu palm-mount mappings must trace to classical sources, not modern Mason 2017 alone',
      'do not import Western planetary correspondences',
    ],
    karmicSupported: 'yes',
    toneExamples: INDIAN_VOICE,
  },
  'CHINESE.WU_XING': {
    tradition: 'chinese',
    traditionNameNative: 'Wǔ Xíng (五行) Xiāng',
    subStyleLabel: 'Five Elements (Wu Xing 五行)',
    scope:
      'Chinese sub-style mapping the hand to the Five Phases (Wood, Fire, Earth, Metal, Water). Hand shape categorizes the Phase; reading flows from Phase characteristics and zàng-fǔ (organ) tendencies.',
    canonicalSources: [
      'Má Yī Shén Xiàng (麻衣神相), Song dynasty Daoist tradition',
      'Shén Xiàng Quán Biān (神相全编), Ming compendium',
      'Wang, X., Physiognomy in Ming China, 2020 (academic study)',
    ],
    legitimateMarkers:
      'Five hand-shape types: Wood (long-narrow), Fire (rectangular with long fingers), Earth (square), Metal (square with shorter fingers), Water (soft and plump). Each has constitutional tendencies derived from Wǔ Xíng cosmology.',
    glossary:
      'Use Chinese terms with pinyin: qì (氣, vital energy), shén (神, spirit), mìng (命, allotment), Wǔ Xíng (五行, Five Phases), Tiān-Rén-Dì (heaven-human-earth, three lines). Line names: Tiān wén (天紋, heart line), Rén wén (人紋, head line), Dì wén (地紋, life line).',
    disallowedExtensions: [
      ...SHARED_DISALLOWED,
      'do not invoke past-life karma — Chinese tradition does not source it from primary palmistry record',
      'do not import Indian planetary mount meanings',
    ],
    karmicSupported: 'no',
    toneExamples: CHINESE_VOICE,
  },
  'CHINESE.MA_YI_CLASSICAL': {
    tradition: 'chinese',
    traditionNameNative: 'Má Yī Shén Xiàng (麻衣神相)',
    subStyleLabel: 'Classical Ma Yi lineage',
    scope:
      'Chinese sub-style anchored to the Má Yī (Hempen-Robe) lineage and the Chen Tuan transmission. Reads the hand as one face of the broader physiognomic system; the heart is the root of countenance.',
    canonicalSources: [
      'Má Yī Shén Xiàng (麻衣神相), attributed to Daoist Ma Yi (Song dynasty)',
      'Liǔ Zhuāng Xiàng Fǎ (柳庄相法), Ming dynasty',
      'Bīng Jiàn (冰鉴), Zēng Guófān (Qing dynasty)',
    ],
    legitimateMarkers:
      'Spirit (shén) and bone before flesh; rank-ordered observation. Hand reads in concert with face per the lineage. Mìng (allotment) themes — broad destiny dispositions only, not specific events. Tradition attributes pseudepigraphal works to Ma Yi; AI must hedge accordingly.',
    glossary:
      'Use Chinese terms: shén (神, spirit), gǔ (骨, bone), ròu (肉, flesh), qì (氣), mìng (命, allotment), biàn (變, change). Mìng themes are broad dispositions, never specific events.',
    disallowedExtensions: [
      ...SHARED_DISALLOWED,
      'pseudepigraphal Má Yī attributions must be hedged with "tradition attributes…"',
      'mìng themes are broad dispositions — never specific events or named past-life identities',
    ],
    karmicSupported: 'partial',
    toneExamples: CHINESE_VOICE,
  },
  'CHINESE.BAGUA_PALMISTRY': {
    tradition: 'chinese',
    traditionNameNative: 'Bāguà (八卦) Xiāng',
    subStyleLabel: 'Eight Trigrams (Bagua) palmistry',
    scope:
      'Chinese sub-style mapping the palm to the eight trigrams plus a centre Míng Táng — nine zones. Each palace governs a life domain (career, wealth, marriage, family, etc.) per the Yìjīng cosmology.',
    canonicalSources: [
      'Hé Luò Lǐ Shù — Yìjīng-derived palace mapping',
      'Shén Xiàng Quán Biān (神相全编), Ming compendium',
    ],
    legitimateMarkers:
      'Eight palaces (Qián, Kūn, Zhèn, Xùn, Kǎn, Lí, Gèn, Duì) plus centre Míng Táng. Each governs a domain: Qián = father / leadership; Kūn = mother / nurture; Zhèn = elder son / movement; Xùn = elder daughter / wind / messenger; Kǎn = middle son / water / hardship; Lí = middle daughter / fire / brightness; Gèn = youngest son / mountain / stillness; Duì = youngest daughter / lake / joy.',
    glossary:
      'Use trigram names with characters: Qián (乾), Kūn (坤), Zhèn (震), Xùn (巽), Kǎn (坎), Lí (離), Gèn (艮), Duì (兌). Centre is Míng Táng (明堂).',
    disallowedExtensions: [
      ...SHARED_DISALLOWED,
      'palace meanings derive from Yìjīng cosmology, not from Indian planetary correspondences',
      'Bagua boundary precision in primary text is not fully attested — note "tradition attributes" where appropriate',
    ],
    karmicSupported: 'no',
    toneExamples: CHINESE_VOICE,
  },
};

export function getTradition(subStyle: SubStyleId): TraditionMeta {
  return TRADITIONS[subStyle];
}
