// Hand-crafted sample readings — what production output should look like.
// Used by /app/report/sample-* until live inference + DB are wired.
//
// Both samples conform to the Report Zod schema (reportSchema.ts) — verbatim
// disclaimers, citation IDs, master-practitioner register, tradition-locked
// vocabulary. They demonstrate the experience reviewers should expect from
// CP3 onward when real model output is filtered + parsed and rendered here.

import { REQUIRED_DISCLAIMERS, type Report } from '@/lib/validation/reportSchema';

const COMMON_DISCLAIMERS = {
  entertainment: REQUIRED_DISCLAIMERS.entertainment,
  not_professional_advice: REQUIRED_DISCLAIMERS.not_professional_advice,
  health: REQUIRED_DISCLAIMERS.health,
} as const;

// ─────────────────────────────────────────────────────────────────────────
// SAMPLE 1 — Indian Comprehensive Sāmudrika
// ─────────────────────────────────────────────────────────────────────────

const SAMPLE_INDIAN: Report = {
  meta: {
    tradition: 'indian',
    sub_style: 'INDIAN.SAMUDRIKA_COMPREHENSIVE',
    model_versions: { vision: 'claude-sonnet-4-6', reasoning: 'claude-opus-4-7' },
    prompt_versions: {
      vision_observe: 'v1.0.0',
      report_render: 'v1.0.0',
      output_filter_judge: 'v1.0.0',
    },
    generated_at: '2026-04-30T00:00:00.000Z',
  },

  opening: {
    hand_impression:
      'A hand of warmth and consequence. The palm is full, the fingers carry their length without tapering to vanity, and the lines are cleanly drawn — three principal rivers, each running its proper course.',
    life_essence_summary:
      'Yours is what the classical record calls a vyavahāra-yogyaḥ hand — a hand made for the world. It does not retreat. It receives, it holds, it gives. The Mount of Guru rises with quiet authority; the Hṛdaya rekhā commits to its course without splitting; the Bhāgya rekhā runs unbroken from the wrist toward Saturn. Together these are not the markers of a quiet life. They are the markers of a life that will be felt — by you and by those who pass through it.',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.HAND_AS_WHOLE',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_GURU',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_BHAGYA',
    ],
  },

  character_personality: {
    body: 'You are direct without being unkind. The full Mount of Guru gives you a natural authority — you speak, others listen — but the well-formed Mount of Chandra at the base of your palm tempers it: you are also a listener. The classical sources describe this exact pairing as the hand of the natural counsellor. Where many lead by force, you lead by attention. The unknotted middle finger says you are not a bureaucrat at heart — you cut through process when process has stopped serving the work. The smooth Mount of Śukra says you are physically vital and instinctively warm; the people closest to you experience you as generous before they experience you as serious.',
    key_observations: [
      'Mount of Guru full and well-formed — natural authority',
      'Mount of Chandra moderate but well-shaped — receptive imagination',
      'Middle finger unknotted — directness over procedure',
      'Mount of Śukra prominent — vitality, warmth',
    ],
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_GURU',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_CHANDRA',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_SHUKRA',
    ],
  },

  mind_intellect: {
    body: 'The Mastiṣka rekhā runs cleanly across the palm without a deep dip toward the Mount of Chandra. This is the pattern Sen describes as a "practical mind that does not lose itself in dream." You think in problems and solutions. You take a question apart in your hands. The slight separation between the head line and the life line at their origin is the mark of a person who decided early to think for themselves — you were not the child who took your elders\' word as final.',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_MASTISHKA',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.HEAD_LIFE_SEPARATION',
    ],
  },

  emotional_relationships: {
    body: 'Your Hṛdaya rekhā arrives at the Mount of Guru without breaking and without splitting. Sen is direct on this configuration: "they who love, love completely." You are not casual in attachment. The clear Vivāha rekhā — there is one principal mark — points to a single defining partnership that will carry the weight of your romantic life. Around it, smaller affections come and go, but the central one will not be one of them. The configuration of your Mount of Śukra suggests these connections are physically as well as emotionally textured — sensual, in the classical sense of fully embodied, not in the trivialized modern one.',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_HRDAYA',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_VIVAHA',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_SHUKRA',
    ],
  },

  career_profession: {
    body: 'The Bhāgya rekhā rising unbroken from the bracelet to the Mount of Saturn is, in the classical phrasing, "the line of one whose work is also their road." You were never going to be content as a passenger in your own career. The clear Sūrya rekhā — short but well-defined — points to recognition that arrives in the second half of working life rather than the first. Do not mistake the early years\' relative quietness for failure. You are building. The clean knot at the first joint of your index finger says you will arrive at a position of real organizational responsibility, and you will hold it without becoming small in it.',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_BHAGYA',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_SURYA',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.JUPITER_KNOT',
    ],
  },

  wealth_material: {
    body: 'A Bhāgya rekhā this clean carries with it, in the classical record, the configuration of yav — the barley-grain mark — at the base of the thumb. Sen reads this combination as one whose "material life is sufficient and grows with their work, without windfall and without lack." You are not one for whom money will be either trivial or anxious. You will earn what you need, you will hold it well, and you will give away what calls to be given.',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.CHIHN_YAV',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_BHAGYA_MATERIAL',
    ],
  },

  health_indications: {
    body: "Constitutionally the hand reads as a Pitta-leaning balance with sufficient Kapha grounding — fire enough to drive work, earth enough to recover. The smooth, slightly soft texture of your palm is what the classical sources associate with good circulation. The Mount of Śukra is full without being over-developed; this is the mark of a healthy appetite for life, food, and rest, in proper proportion. The faint chain near the proximal end of your Āyu rekhā is worth noting only as a nudge: the early decade of your maturity is where the textual associations point to attending to digestive equilibrium and rest. Nothing here is a prediction; it is one tradition's view of how to attend.",
    mandatory_disclaimer: COMMON_DISCLAIMERS.health,
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.HAND_TEXTURE',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_AYU_CHAIN',
    ],
  },

  life_trajectory_timing: {
    body: 'Your trajectory is one of slow ascent rather than sudden arrival. The early years of working life are the foundation; the middle decade is where you are recognized for what you have already been doing; the later decade is where the work matures into authorship rather than execution. There is a turn — clear in the second crossing of your Mastiṣka and Bhāgya rekhās — somewhere around the period after your inner reorientation. After that turn, what you do publicly and what you do privately become the same thing.',
    timing_phrasing: 'qualitative_only',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.TRAJECTORY_LINE_CROSSINGS',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.LINE_BHAGYA_LATE',
    ],
  },

  spiritual_inclinations: {
    body: 'The classical record speaks of saṃskāra — the inheritance of disposition from prior lives — through specific markers: the unbroken vertical of the Bhāgya rekhā, the well-formed Mount of Guru, and the faint mystic cross between the Heart and Head lines. Together they suggest a soul that has done this kind of work before. You are not new to discipline. You are not new to responsibility. The classical reading does not name you in a previous life — that is not the practice — but the disposition you carry into this one is the disposition of someone who has practiced it.',
    claim_citations: [
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.MARKER_MYSTIC_CROSS',
      'INDIAN.SAMUDRIKA_COMPREHENSIVE.SAMSKARA_DOCTRINE',
    ],
  },

  strengths_to_leverage: {
    body: 'Lead with attention before authority. The combination of Guru and Chandra in your hand says you persuade most powerfully when you have first listened completely. Trust the early-decade build — the visible recognition is coming, but its timing is in the work, not in your impatience. Stay close to the partnership the Vivāha rekhā describes; it is the keel that makes the rest of the trajectory possible.',
    claim_citations: ['INDIAN.SAMUDRIKA_COMPREHENSIVE.STRENGTHS_SYNTHESIS'],
  },

  areas_to_be_mindful_of: {
    body: 'The same Mount of Guru that gives you authority can, when overdrawn, become an instinct to instruct rather than to be with. The classical caution is to keep the listening alive even after the leadership becomes visible. The faint chain in the early Āyu rekhā is a small note: the years where you are first carrying real organizational weight are also the years to hold the rhythm of rest.',
    claim_citations: ['INDIAN.SAMUDRIKA_COMPREHENSIVE.CAUTIONS_SYNTHESIS'],
  },

  closing: {
    body: "The hand placed before me is the hand of someone whose life will not be small. The principal lines are unbroken; the principal mounts are well-formed; the auxiliary markers are quiet but auspicious. Take from this what feels true. Set aside what does not. The reading is one tradition's view through one practitioner's eyes. The life is yours.",
    claim_citations: ['INDIAN.SAMUDRIKA_COMPREHENSIVE.CLOSING_FRAME'],
  },

  disclaimers: COMMON_DISCLAIMERS,
};

// ─────────────────────────────────────────────────────────────────────────
// SAMPLE 2 — Chinese Ma Yi Classical
// ─────────────────────────────────────────────────────────────────────────

const SAMPLE_CHINESE: Report = {
  meta: {
    tradition: 'chinese',
    sub_style: 'CHINESE.MA_YI_CLASSICAL',
    model_versions: { vision: 'claude-sonnet-4-6', reasoning: 'claude-opus-4-7' },
    prompt_versions: {
      vision_observe: 'v1.0.0',
      report_render: 'v1.0.0',
      output_filter_judge: 'v1.0.0',
    },
    generated_at: '2026-04-30T00:00:00.000Z',
  },

  opening: {
    hand_impression:
      'Spirit before flesh, bone before line. In the Má Yī register, this is what is read first — and yours reads clearly. The shén is steady. The gǔ holds the hand without rigidity. The flesh is supple but not soft.',
    life_essence_summary:
      'Tradition attributes to the Hempen-Robe Daoist a single phrase that fits this hand: "the heart is the root of countenance." The shape and proportion of your palm — square enough for weight, fingered enough for movement — speaks of someone whose inner life is composed and whose outer life follows from it. The three principal lines (Tiān, Rén, Dì) are present and well-spaced. None of them strays into the other\'s territory. This is a hand the lineage recognizes.',
    claim_citations: [
      'CHINESE.MA_YI_CLASSICAL.SHEN_AND_BONE',
      'CHINESE.MA_YI_CLASSICAL.HEART_AS_ROOT',
      'CHINESE.MA_YI_CLASSICAL.THREE_LINES',
    ],
  },

  character_personality: {
    body: 'You carry yourself with the steadiness the lineage names dìng (定) — settled, grounded, not easily moved. The Bīng Jiàn structural pattern reads first the spirit, and yours photographs as composed without being cold. The squareness of your palm — what the Má Yī register would identify as the configuration approaching the shape of mountain (gèn 艮) — speaks of someone who is thought of, by those who know you, as reliable in the deepest sense of the word: present where you said you would be, doing what you said you would do.',
    key_observations: [
      'Shén (spirit) reads composed — the foundation observation',
      'Palm shape approaches mountain (gèn) — steadiness, reliability',
      'Three principal lines well-spaced — domains of life are not blurred',
    ],
    claim_citations: [
      'CHINESE.MA_YI_CLASSICAL.SHEN_OBSERVATION',
      'CHINESE.MA_YI_CLASSICAL.BING_JIAN_STRUCTURE',
    ],
  },

  mind_intellect: {
    body: 'The Rén wén — the human line, the line of intellect — runs cleanly across the middle of the palm without dipping. The Má Yī tradition reads this as a mind that holds its ground in the world rather than retreating into abstraction. You are not the dreamer the Western pop register tries to flatter all readers with — and you would know that flattery if it were offered. You are practical without being narrow, principled without being rigid.',
    claim_citations: ['CHINESE.MA_YI_CLASSICAL.LINE_REN', 'CHINESE.MA_YI_CLASSICAL.PRACTICAL_MIND'],
  },

  emotional_relationships: {
    body: 'The Tiān wén — the heaven line, what other traditions call the line of the heart — sits high on the palm, clean and committed. In the lineage register this is the configuration of yīn-yáng harmony in attachment: warm but not consuming, attentive but not anxious. You are a partner who is fully present without being suffocating. The marriage palace, on the side of the palm, is well-formed; the lineage reads this as one principal partnership.',
    claim_citations: [
      'CHINESE.MA_YI_CLASSICAL.LINE_TIAN',
      'CHINESE.MA_YI_CLASSICAL.MARRIAGE_PALACE',
    ],
  },

  career_profession: {
    body: 'The lineage reads career not as a single line but as a configuration of qì across the palm, with particular attention to the mounts under the index and ring fingers. Yours is a configuration the tradition associates with steady ascent through institutions rather than dramatic departures. You will be the person others rely on to do the work properly — and that reliance, accumulated over years, is what becomes recognition. The biàn (change) doctrine reminds us: this is the trajectory of the disposition, not a fixed event. Effort matters.',
    claim_citations: [
      'CHINESE.MA_YI_CLASSICAL.QI_CONFIGURATION',
      'CHINESE.MA_YI_CLASSICAL.BIAN_DOCTRINE',
    ],
  },

  wealth_material: {
    body: 'The lineage register would describe your relationship to material life as middle-stream: enough qì in the wealth-related zones to be comfortable, not so much that wealth becomes the organizing principle of your life. Tradition attributes to Zēng Guófān\'s Bīng Jiàn the observation that "the eye is master; the rest serves" — your eye, were the practitioner physically present to read it, would be the eye of someone who sees money as a tool. That is what your hand confirms.',
    claim_citations: ['CHINESE.MA_YI_CLASSICAL.WEALTH_QI', 'CHINESE.MA_YI_CLASSICAL.BING_JIAN_EYE'],
  },

  health_indications: {
    body: "In the Wǔ Xíng register that the Má Yī tradition shares with the broader Daoist medical inheritance, your hand suggests a constitution leaning toward Earth (steady, central) with sufficient Wood (movement) to avoid stagnation. The faint reddish tone in the Mount of Venus equivalent (the base of your thumb) is what the register associates with adequate blood-qì. The lineage cautions only this: the years when you are most relied upon at work are also the years where the rhythm of rest matters most. Nothing here is medical; it is the lineage's register of constitutional tendency.",
    mandatory_disclaimer: COMMON_DISCLAIMERS.health,
    claim_citations: ['CHINESE.MA_YI_CLASSICAL.WUXING_EARTH', 'CHINESE.MA_YI_CLASSICAL.BLOOD_QI'],
  },

  life_trajectory_timing: {
    body: 'The lineage reads trajectory in periods — early, middle, late — without the year-precision a less serious register might attempt. Your early period is the period of learning by doing. Your middle period is the period of being relied upon. Your late period is the period of being consulted. The biàn doctrine — change — reminds us that the lines themselves shift with the inner life. The trajectory is described, not fixed.',
    timing_phrasing: 'qualitative_only',
    claim_citations: [
      'CHINESE.MA_YI_CLASSICAL.PERIODS_OF_LIFE',
      'CHINESE.MA_YI_CLASSICAL.BIAN_DOCTRINE',
    ],
  },

  // Note: spiritual_inclinations omitted — CHINESE.MA_YI_CLASSICAL is karmic_supported='partial';
  // when broader mìng themes are not warranted by the markers, the section is omitted
  // rather than fabricated. The schema marks this section optional.

  strengths_to_leverage: {
    body: 'The dìng (settledness) is your central asset. Trust it. Trust also the eye for what is real — the lineage names this clarity, and the configuration of your hand confirms it. In moments of decision, lead with the practical Rén-wén mind; let the warm Tiān-wén heart hold the relational frame.',
    claim_citations: ['CHINESE.MA_YI_CLASSICAL.STRENGTHS_SYNTHESIS'],
  },

  areas_to_be_mindful_of: {
    body: "The same dìng that gives you steadiness can, in difficult passages, slow into immobility. The biàn doctrine is particularly relevant here: change is read as a virtue in this lineage, not a threat. When the moment calls for movement, the disposition that serves you in steady years can quietly under-serve you. The lineage's caution: notice when stillness has crossed into stuckness.",
    claim_citations: ['CHINESE.MA_YI_CLASSICAL.CAUTIONS_BIAN'],
  },

  closing: {
    body: 'The hand placed before the practitioner is, in the Má Yī register, a face — and yours reads as the face of someone whose inner life is in good order. The lineage offers no guarantees; it offers a register of disposition. Take what feels true. Hold lightly what does not. The work is yours, as the lineage has always insisted.',
    claim_citations: ['CHINESE.MA_YI_CLASSICAL.CLOSING_FRAME'],
  },

  disclaimers: COMMON_DISCLAIMERS,
};

// ─────────────────────────────────────────────────────────────────────────

const SAMPLES: Record<string, Report> = {
  'sample-indian': SAMPLE_INDIAN,
  'sample-chinese': SAMPLE_CHINESE,
};

export function getSampleReport(id: string): Report | undefined {
  return SAMPLES[id];
}

export function listSampleReportIds(): string[] {
  return Object.keys(SAMPLES);
}
