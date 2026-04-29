# Research Base — Palm Reading Traditions

> Every factual claim made by the AI in this product must trace to a citation in this file. No exceptions. Cross-tradition contamination (e.g., applying Indian heart-line meaning to a Chinese reading) is treated as an unsafe output and must be filtered.

## How to read this file

- Each tradition has its own top-level section.
- Each sub-style has primary text citations + a "core claims" subsection + "disallowed extensions" + a `karmic_supported` flag.
- Citations follow this format strictly:
  - **Source A**: [Author, Title, Year/Era, Edition, Chapter or Page] (Primary text)
  - **Source B**: [Author, Title, Year, Page] (Cross-verification, reputable secondary)
- A claim with only one source is flagged `[NEEDS CROSS-VERIFICATION]`.
- A claim flagged `[CITATION GAP]` means the secondary record asserts the primary text contains it, but the verbatim verse has not been verified against a critical edition. Treat as provisional until human follow-up.
- Any classical text titled with a personal-name attribution (e.g., "Garga Samhita," "Ravana Samhita") is flagged for the human reviewer because attribution to legendary figures is conventional in Sanskrit pseudepigrapha and does not equal authorship.

## Index

1. Indian palmistry tradition
   - 1.1 Comprehensive Samudrika Shastra
   - 1.2 Hasta-Rekha (line-focused)
   - 1.3 Mount-based / planetary
2. Chinese palmistry tradition
   - 2.1 Five Elements (Wu Xing 五行)
   - 2.2 Classical Ma Yi (麻衣) lineage
   - 2.3 Eight Trigrams (Bagua 八卦) palmistry
3. Shared anatomical / observational vocabulary
4. Disallowed extensions (consolidated)
5. Tone and language conventions
6. Sources bibliography (full)
7. Verification status and known gaps

---

## 1. Indian palmistry tradition

The umbrella discipline is **Sāmudrika Śāstra** (सामुद्रिक शास्त्र), "the science of bodily marks/signs," within which **Hasta Sāmudrika** / **Hasta Rekhā Śāstra** is the hand-specific subdiscipline. The root tradition is part of the broader Jyotiṣa (Vedic astrology) corpus, and palmistry in the classical Indian record is rarely separated from planetary symbolism.

### Primary text inventory (shared across all three sub-styles)

- **Bṛhat Saṃhitā** by Varāhamihira (ca. 6th c. CE) — the encyclopedic compendium of Jyotiṣa. Chapter 51 (_Aṅga-vidyā_, "prediction through limbs") and Chapter 68 (_Puruṣa-lakṣaṇa_, "features of men") and Chapter 70 (_Kanyā-lakṣaṇa_, "features of women") contain physiognomic and palm-relevant material. Critical edition cited in this file: Subrahmanya Sastri & Ramakrishna Bhat, V. B. Soobbiah & Sons, 1946 (chapter 68 begins on p. 542 of that edition). [CITATION GAP] for verbatim verses 68.1–68.20 — the contents page of the 1946 edition confirms the chapter exists but the verses were not extracted in this research pass; flag for human follow-up.
- **Sāmudrika-tilaka** by Durlabharāja and his son Jagaddeva (ca. 1160 CE), originally titled _Nara-lakṣaṇa-śāstra_; published edition: Sri Venkateswar Steam Press, 1954. One of the earliest _named_ (non-pseudepigraphal) Indian palmistry/physiognomy treatises.
- **Sāmudrika-cintāmaṇi** by Madhava Śrī-grāma-kāra (ca. 1700 CE) — closely follows the _Sāmudrika-tilaka_.
- **Śaiva Sāmudrika** and **Jaina Sāmudrika** — sectarian compilations; the Jaina version is associated with Meghavijayagaṇi (1680s).
- **Hasta-Sañjīvanī** (हस्त संजीवनी) — Meghavijayagaṇi attribution.
- **Hasta Sāmudrika Śāstra** (anonymous, often-printed compendium) — modern English-language critical study by K. C. Sen, _Hast Samudrika Shastra: The Indian Science of Hand Reading_, D. B. Taraporevala Sons & Co., Bombay, 1960. Used in this file as a _secondary scholarly_ source that quotes and translates earlier Sanskrit material.
- **Sārīraka Śāstra (Kārtikeyan System)** — translated by V. A. K. Ayer, 1960.
- **Pseudepigraphal works** (cite only with caveat): _Ravaṇa Saṃhitā_, _Gārga Saṃhitā_ (the physiognomy-attributed Garga, distinct from the Vaishnava devotional _Garga Saṃhitā_ about Krishna), _Naṣṭa-jātaka_, _Sāmudrika-bhūṣaṇa_. These are conventionally credited to legendary sages and lack stable critical editions; flag any AI use of them with a "tradition attributes…" hedge.

### General attestation rules for Indian sub-styles

- Indian palmistry assigns **all areas of the hand (mounts, fingers, segments, lines) to the nine planets (graha)** of Jyotiṣa, and the meanings of those areas reflect the planet's _kārakatva_ (innate significations). This is the unifying theoretical move across all three Indian sub-styles below. [Wikipedia, *Samudrika Shastra*, retrieved 2026; Sen, 1960; Mason, 2017.]
- In Indian practice, **for males the right hand is primary; for females the left** — the _opposite_ convention from Chinese practice. [Wikipedia, *Palmistry*, retrieved 2026; cross-referenced in Mason, 2017.]
- Most classical Indian palmists are simultaneously trained in Jyotiṣa; the planetary chart and the hand are read as a mutually-reinforcing system, not independently. [Sen, 1960, Introduction; Mason, 2017.]

---

### 1.1 Sub-style: Comprehensive Sāmudrika Śāstra

**Scope.** This is the broadest reading style: the practitioner observes the entire hand _and_ contextualizes it within whole-body Sāmudrika (foot, gait, voice, complexion, body proportion). It is the closest sub-style to Varāhamihira's encyclopedic approach.

**Primary text citations.**

- Varāhamihira, _Bṛhat Saṃhitā_, ca. 6th c. CE — Chapters 51 (_Aṅga-vidyā_), 68 (_Puruṣa-lakṣaṇa_), 70 (_Kanyā-lakṣaṇa_). Edition: Subrahmanya Sastri & Ramakrishna Bhat, 1946. [CITATION GAP for individual verses.]
- Durlabharāja & Jagaddeva, _Sāmudrika-tilaka_, ca. 1160 CE. Sri Venkateswar Steam Press edition, 1954.
- Cross-verification: Sen, _Hast Samudrika Shastra_, 1960 (introductory chapters cite the above).

**Core claims attestable from this sub-style's primary record.**

1. The hand reveals personality, destiny tendencies, and karmic inheritance — but only when read as one of many bodily signs (face, voice, gait, etc. all matter). [Sen, 1960, Introduction; Wikipedia, *Samudrika Shastra*, retrieved 2026.]
2. **Fish mark (matsya-cihna)** on the hand: "connotes high social position, wealth, children, a long-lived and loving husband." (Direct quotation reported by Sen, 1960, summarizing Hindu tradition.) Cross-verified in Mason, 2017, who lists _matsya_ among the _cihna_ (auspicious symbols).
3. **Conch (śaṅkha) mark**: "When it is present, it denotes a millionaire." (Sen, 1960.) Cross-verified in Mason, 2017 (śaṅkha listed among auspicious _cihna_).
4. **Temple mark**: "indicative of good social position and wealth." (Sen, 1960.) [NEEDS CROSS-VERIFICATION] — only one English-medium scholarly source attests; classical Sanskrit verse for this specific symbol not directly verified in this pass.
5. **Trident (triśūla)**: associated with success and distinction; auspicious. (Sen, 1960; Mason, 2017.)
6. **Lotus (padma)** and **flag (dhvaja)**: distinction, recognition, royal favor. (Mason, 2017; Sen, 1960.)
7. **Yav (barley) / island at thumb base**: "a well-defined island or Yav points to plentiful posterity, a generous number of sons and grandsons." (Sen, 1960.) [NEEDS CROSS-VERIFICATION] in independent classical critical edition.
8. The hand is one of the bodily fields where **karma from previous lives** is encoded — explicitly invoking Manu: "Success in all worldly affairs depends upon the laws of destiny controlled by the actions of mortals in their previous lives." (Sen, 1960, quoting _Manu-smṛti_.) The classical position is _not_ fatalism: lines change with mental development and effort.
9. Entire-body Sāmudrika takes precedence over hand-only reading when signs conflict — the wider observation governs. (Implicit in Varāhamihira's structuring; explicit in Sen, 1960.) [NEEDS CROSS-VERIFICATION] for an explicit verse stating priority.

**Regional variations recorded in the classical record.**

- **Western India (Gujarat / Rajasthan / Jaina compilations):** _Sāmudrika-tilaka_, _Sāmudrika-cintāmaṇi_, _Sāmudrika_. Heavily Jaina-influenced lineages place greater weight on auspicious symbols (_cihna_) and ascetic body markers. [Wikipedia, *Samudrika Shastra*, retrieved 2026.]
- **Mithila (Bihar / eastern north India):** _Sāmudrika-tantra_, attributed to Śiva, ca. 1847–1848 CE; localized text. [Wikipedia, *Samudrika Shastra*, retrieved 2026.]
- **Nepal / northern manuscript stream:** alternate _Sāmudrika_ attributed to Śrī-Lakṣmaṇācārya Bhaṭṭa.
- **Tamil / South Indian:** Manuscripts at the Government Oriental Manuscripts Library, Chennai. The _Kārtikeyan system_ translated by V. A. K. Ayer (1960) under the title _Sārīraka Śāstra_ represents a South Indian transmission. North-vs-South _doctrinal_ divergence at the level of specific line meanings is **not clearly attested in the secondary scholarly record** consulted in this pass — flag as `[NEEDS CROSS-VERIFICATION]`. The differences are primarily textual-transmission and emphasis, not contradictory doctrine.
- **Earliest Jaina translation manuscript:** _Sāmudrika-lakṣaṇa_, Sanskrit-to-Hindi, dated 1507 CE.

**`karmic_supported: true`** — primary sources of this sub-style explicitly invoke past-life karma, _Manu-smṛti_ destiny doctrine, and Jyotiṣa's planetary-karma framework. The AI may speak of karmic patterns in this sub-style.

**Disallowed extensions specific to this sub-style.**

- Do not _name_ a specific past-life identity. The primary record speaks of karmic _tendency_ and _inherited disposition_, never of "you were [historical person] in a past life."
- Do not predict exact lifespan. (See section 4 and tone-section excerpt from Sen below.)
- Do not interpret a hand sign as overriding obvious whole-body or astrological evidence — the comprehensive method explicitly subordinates one bodily field to the whole.

---

### 1.2 Sub-style: Hasta-Rekhā (line-focused)

**Scope.** This sub-style emphasizes the **rekhā** (lines) on the palm above all other features. It is the closest Indian analogue to what Western audiences recognize as "palmistry," but it is rooted in the planetary framework of Jyotiṣa, not in Western astrology.

**Primary text citations.**

- _Hasta-Sañjīvanī_, attributed to Meghavijayagaṇi (Jaina lineage, late 17th c.). [CITATION GAP for verses.]
- _Hasta-Cihna-Sūtra_, _Kara-rekhā-prakaraṇa_ — ancillary line-focused texts named in N. L. Desai, "History and Origin of Palmistry," _Saptarishis Astrology_ (online).
- Sen, _Hast Samudrika Shastra_, 1960 — devotes its main exposition to lines.
- Mason, _Vedic Palmistry: Hastā Rekhā Śāstra_, Singing Dragon / Jessica Kingsley Publishers, 2017 — modern reputable scholar-practitioner; structures the discipline around Pradhāna (primary lines), Aṃśa (secondary lines), Prakīrṇa (miscellaneous lines).

**Core claims attestable from this sub-style's primary record.**

The line nomenclature in classical Sanskrit Hasta-Rekhā:

- **Āyu rekhā / Jīvana rekhā** — life line. Marks vitality, lifespan tendency, major life shifts. (Sen, 1960, calls the heart line "Ayu Rekha" in one passage; multiple sources use _Āyu rekhā_ for life line. The terminology is **not perfectly stable across regional manuscripts** — flag for clarification with the primary critical edition.) [NEEDS CROSS-VERIFICATION on the specific term–line mapping; defer to Mason, 2017 for the modern consensus mapping.]
- **Mastiṣka rekhā / Buddhi rekhā / Śīrṣa rekhā** — head line. Reasoning, intellect.
- **Hṛdaya rekhā** — heart line. Emotional life, affections.
- **Bhāgya rekhā** — fate line. Career, worldly fortune.
- **Sūrya rekhā / Ravi rekhā** — Sun line. Recognition, fame, success.
- **Vivāha rekhā** — marriage line(s), located on the Mount of Mercury.
- **Santāna rekhā** — children line(s).

(All seven names cross-verified between Sen, 1960; Mason, 2017; and Wikipedia, _Samudrika Shastra_, retrieved 2026.)

Specific declarative claims attested in primary/critical secondary sources:

1. **"Straight fingers indicate a fortunate person."** Direct quote from Sen, 1960. [NEEDS CROSS-VERIFICATION] for Sanskrit verse origin.
2. **"If the little finger is nearly as long as the third [ring finger], it is the mark of a savant and philosopher."** Direct quote from Sen, 1960. [NEEDS CROSS-VERIFICATION].
3. A clear, well-marked **head line**, in combination with specific finger formations, indicates talent for languages. (Sen, 1960.) [NEEDS CROSS-VERIFICATION].
4. A hollow palm beneath the heart line "indicates that there will be disappointment in affections." (Sen, 1960, direct quote.) [NEEDS CROSS-VERIFICATION].
5. The **fate line and Sun line being conspicuously absent** does _not_ automatically mean misfortune — wealth can be indicated by other marks (e.g., temple). The classical method _does not read a single line in isolation_; combinations govern. (Sen, 1960.)
6. **Lines change with the life of the person.** Sen, 1960: "Under the influence of a strong will the lines of the palm undergo changes corresponding to the altered life of the person." This is the doctrinal anchor for partial free will in Indian palmistry.
7. **Marriage-line "child lines" are not deterministic of literal children.** Sen, 1960 explicitly notes: "people with lines of children on the Marriage line… have sometimes been found to be childless." This is a critical caveat the AI must reproduce.

**`karmic_supported: true`** — the line-focused sub-style retains the karmic substrate from the parent tradition (Sen, 1960, foregrounds Manu's destiny doctrine in its opening framing). However, the doctrine of _line mutability_ explicitly preserves human agency.

**Disallowed extensions specific to this sub-style.**

- Do not assign a _specific number of children_ from the marriage-line "children lines." The primary record explicitly disclaims this.
- Do not date events to a specific year from line position without using a documented Sanskrit time-mapping system. (Sanskrit _kālamāna_ / time-mapping schemes exist — e.g., Mason, 2017, "Kālamāna Rekhā" chapter — but they are approximative, decade-bracket systems, not annual.)
- Do not declare a line "missing" with absolute confidence in any reading where the photograph quality / lighting is degraded.

---

### 1.3 Sub-style: Mount-based / planetary

**Scope.** This sub-style foregrounds the **mounts (parvata)** of the palm — the fleshy elevations associated with the _navagraha_ (nine planets / planetary deities). Mount-prominence, color, firmness, and the markings _upon_ each mount are read as expressions of that planet's significations in the subject's life. This is the sub-style most tightly bonded to Jyotiṣa.

**Primary text citations.**

- _Sāmudrika-tilaka_ (Durlabharāja & Jagaddeva, ca. 1160 CE) — assigns body regions to planetary signification.
- Varāhamihira, _Bṛhat Saṃhitā_, ch. 51 (_Aṅga-vidyā_) — limb-prediction by planetary association. [CITATION GAP for verbatim verses.]
- Mason, _Vedic Palmistry_, 2017, "Introduction to the Planets" and "Planetary Portraits" sections — modern comprehensive treatment.
- Sen, _Hast Samudrika Shastra_, 1960 — chapter on mounts.

**Core claims attestable from this sub-style's primary record.**

The nine mounts (planetary attribution and core kārakatva):

| Mount (Sanskrit)                        | Planet    | Core kārakatva                                                                | Source                                                                                                                                                                                              |
| --------------------------------------- | --------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Guru parvata (Jupiter)                  | Bṛhaspati | Ambition, leadership, religious / dharmic disposition, pride.                 | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Śani parvata (Saturn)                   | Śani      | Discipline, seriousness, balance, reasoning, melancholy, longevity.           | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Sūrya / Ravi parvata (Sun / Apollo)     | Sūrya     | Artistic capacity, recognition, royal favor, vitality.                        | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Budha parvata (Mercury)                 | Budha     | Commerce, communication, cunning, eloquence.                                  | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Maṅgala parvata — upper (Mars positive) | Maṅgala   | Courage, resolve, martial vigor.                                              | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Maṅgala parvata — lower (Mars negative) | Maṅgala   | Aggression, capacity to resist, temper.                                       | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Candra parvata (Moon)                   | Candra    | Imagination, intuition, emotional fluctuation, the unconscious.               | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Śukra parvata (Venus)                   | Śukra     | Love, eros, family affection, sensual life, fertility.                        | Sen 1960; Mason 2017.                                                                                                                                                                               |
| Rāhu / Ketu (shadow planets)            | —         | Disruptive / liberating influences; varied mount placement across traditions. | Mason, 2017. [NEEDS CROSS-VERIFICATION] for Rāhu/Ketu-specific palm-mount mapping in the classical record — this is well-attested in Jyotiṣa generally but its _palm-mount_ assignment is variable. |

Sen's summary: **"Mounts represent the senses, the natural impulses and emotions."** (Direct quote, 1960.)

**Hand types under the mount-based system** (per Sen, 1960):

- **Large hand** — fond of detailed work.
- **Broad hand** — balanced mind, broad vision.
- **Small hand** — large ideas; visionary.
- **Soft hand** — poetic, imaginative.

**Finger characteristics** (cross-verified Sen 1960 / Mason 2017):

- **Long fingers** — intellectual, sensitive, refined.
- **Short fingers** — quick to act; may overlook detail.
- **Knotty fingers** — analytical, thorough.
- **Smooth fingers** — impulsive; "first thought is generally the right one" (Sen, direct quote).

**Finger tips** (Sen, 1960):

- **Pointed** — dreamers, philosophers, intense self-absorption.
- **Square** — practical, capable, "succeed by clever planning" (Sen, paraphrased).
- **Spatulate** — energetic, reformist.
- **Conical** — impulsive, attracted to beauty.

**Nail observations** (Sen, 1960):

- Long nails — weak constitution, lung tendency.
- Short nails — heart-disease tendency.
- Healthy nail — "transparent, pink, polished."
  > [NEEDS CROSS-VERIFICATION]: nail-to-organ correspondences are also documented in Chinese medical palmistry (see §2). Indian and Chinese systems converge here in _form_ but the AI must cite within the active tradition only — do not blend.

**`karmic_supported: true`** — mounts in the classical Indian system _are_ planetary deities, and planetary karma is foundational to Jyotiṣa. Speaking of "Saturnian karma" or "Jupiter's grace" expressed in a particular mount is fully supported in this sub-style.

**Disallowed extensions specific to this sub-style.**

- Do not give Western "personality archetype" labels to mounts (e.g., "Jupiter people are extroverts") that are absent from the Sanskrit _kārakatva_ tradition. Stay with the Sanskrit-attested _kārakatva_.
- Do not claim a specific medical diagnosis from a mount color / nail observation. The classical text speaks in _tendencies_, not diagnoses.
- Do not assign a deceased-relative-style spiritualist message to Rāhu/Ketu mounts. That is a New Age extension absent from the primary record.

---

## 2. Chinese palmistry tradition

The umbrella discipline is **xiàng** (相) — physiognomy, the inspection of the body for character and fortune. Within it, **shǒu xiàng** (手相, "hand appearance") is hand-specific; **shǒu zhěn** (手診) is the medical-diagnostic branch. Chinese palmistry is doctrinally older than its Indian-Vedic counterpart in _recorded textual_ form for the hand specifically, with attestations from the Han dynasty.

### Primary text inventory (shared across all three Chinese sub-styles)

- **Wáng Chōng (王充), _Gǔ Gé Piān_ / _Gǔ Xiàng_ (骨格篇 / 骨相)** — late Han dynasty, late 1st – early 2nd c. CE. Contained in his _Lùn Héng_ (論衡). Earliest known Chinese discussion containing palmistric / bone-physiognomic material.
- **Cháo Yuán-fāng (巢元方), _Zhū Bìng Yuán Hòu Zǒng Lùn_ (諸病源候總論)** — Sui dynasty, completed 610 CE. Medical text containing **shǒu zhěn** (hand diagnosis) including the _hǔ kǒu luò mài zhěn fǎ_ ("examining the veins at the tiger's mouth method") on the index finger.
- **Lái Hé (來和), _Xiàng Jīng Shí Sì Juàn_ (相經十四卷)** — Sui dynasty (581–618 CE). Fourteen-volume physiognomy classic.
- **Lǚ Dòng-bīn (呂洞賓) attribution, _Xiàng Fǎ Rù Mén_ (相法入門)** — Tang dynasty (618–907 CE). Pseudepigraphal — cite with "tradition attributes…" hedge.
- **Chén Tuán (陳摶, d. 989 CE), _Shén Xiàng Quán Piān_ (神相全篇)** — Song dynasty Daoist; cited in _Shénxiàng Quánbiān_ as foundational. (Note: Chen Tuan's work survives largely through later compendia rather than as a stable independent text.)
- **Wáng Bó (王朴), _Tài Qīng Shén Jiàn_ (太清神鑑)** — Song dynasty.
- **(Attributed to) Má Yī, _Má Yī Shén Xiàng_ / _Má Yī Xiàng Fǎ_ (麻衣神相 / 麻衣相法)** — Daoist Má Yī ("Hempen Robe"), late Five Dynasties / early Song. Often co-attributed with Chén Tuán as transmitter; this is the foundational text of the **Ma Yi lineage** (§2.2). Citations should always carry "attributed to."
- **Yuán Zhōngchè (袁忠徹) (1367–1458), _Liǔ Zhuāng Xiàng Fǎ_ (柳莊相法)** — early Ming. Yuan was court physiognomist to the Yongle emperor.
- **Yuán Zhōngchè (compiler), _Shénxiàng Quánbiān_ (神相全編), "Complete Compendium of Spirit Physiognomy"** — early-to-mid Ming. The single most important encyclopedic Chinese physiognomy manual; reprinted in the _Gǔjīn Tūshū Jíchéng_ (古今圖書集成), chapters 631–644. Earliest extant preface by Ní Yuè (倪岳, 1444–1501).
- **Zēng Guófān (曾國藩) (1811–1872), _Bīng Jiàn_ (冰鑑) — "Ice Mirror"** — Qing dynasty. Primarily face/spirit/voice physiognomy for talent selection; bridges into hand observation only secondarily. Translated as _Ice Identification: A Textbook to Identify and Select Talents in Ancient China_.

### Authoritative scholarly sources for cross-verification (Chinese)

- **Livia Kohn**, "A Textbook of Physiognomy: The Tradition of the _Shenxiang quanbian_," _Asian Folklore Studies_ 45.2 (1986): 227–258. (JSTOR 1178619.) The standard English-language scholarly treatment.
- **Livia Kohn**, "Mirror of Auras: Chen Tuan on Physiognomy," _Asian Folklore Studies_ 47 (1988). (URL: asianethnology.org/article/1317.)
- **Xing Wang**, _Physiognomy in Ming China: Fortune and the Body_. Brill (Sinica Leidensia 152), 2020. The most current academic monograph.
- **Stéphane Homola**, _The Art of Fate Calculation_ (Berghahn Books, 2023) — anthropology of contemporary Chinese fortune-telling practice.
- **Zong Xiao-Fan & Gary Liscum**, _Chinese Medical Palmistry: Your Health in Your Hand_. Blue Poppy Press, 1995. ISBN 0-936185-64-3. Translation-and-synthesis of medical-palmistry primary material.
- **Terence Dukes**, _Chinese Hand Analysis_. Pelanduk Publications, Selangor, 1996. ISBN 978-967-978-248-6. Includes bibliography pp. 329–331. [Treat as comprehensive secondary; verify specific claims against Kohn or Wang where possible.]

### General attestation rules for Chinese sub-styles

- The three principal palm lines map to the cosmological **Sān Cái** (三才, "Three Powers"): **Tiān** (天, Heaven) — generally the heart line; **Rén** (人, Human) — the head line; **Dì** (地, Earth) — the life line. The line-names _Tiān wén_ (天紋), _Rén wén_ (人紋), _Dì wén_ (地紋) are standard. [Cross-verified: Zong & Liscum, 1995; multiple secondary sources; flag *exact line-to-cosmological-position mapping* for verification with the *Shénxiàng Quánbiān* primary text — minor variation exists across editions.]
- Chinese palmistry is integrated with **Wǔ Xíng** (五行, Five Phases / Elements) and **Yīn-Yáng** cosmology and, in many lineages, with the **Bā Guà** (八卦) of the _Yì Jīng_.
- **For males the left hand is primary; for females the right** — _opposite_ of the Indian convention. [Multiple secondary sources; ferrymanstudio and chinaeducationaltours both attest this convention. Ultimate primary attestation should be re-checked against the *Shénxiàng Quánbiān*.] [NEEDS CROSS-VERIFICATION] for explicit primary verse.
- Chinese palmistry sits inside the **Wǔ Shù** (五術, "Five Arts") of Chinese metaphysics — Mountain (cultivation), Medicine, Divination, Destiny, and Physiognomy (相). It is _not_ a free-standing discipline; readings reference all five.

---

### 2.1 Sub-style: Five Elements (Wǔ Xíng 五行)

**Scope.** Hand reading filtered through the _Wǔ Xíng_ — Wood (木), Fire (火), Earth (土), Metal (金), Water (水). The whole hand shape, plus the dominant element of each finger and palm region, is read for _qì_ balance, constitutional tendency, and elemental fortune. This sub-style is the most _medically_ inflected of the three Chinese sub-styles — it is the hand reading of the literate Chinese-medicine practitioner.

**Primary text citations.**

- Wáng Chōng, _Gǔ Xiàng_ (Han dynasty) — earliest layer.
- Cháo Yuán-fāng, _Zhū Bìng Yuán Hòu Zǒng Lùn_ (610 CE) — medical hand diagnosis.
- The _Wǔ Xíng pài_ (五行派, "Five Phase School") of palmistry is referenced in the introductory matter of the _Shénxiàng Quánbiān_. [CITATION GAP for specific verse.]
- Cross-verification: Zong & Liscum, _Chinese Medical Palmistry_, 1995, ch. 1–3.

**Core claims attestable from this sub-style's primary record.**

The five hand types (cross-verified Zong & Liscum, 1995; Dukes, 1996; multiple secondary):

| Hand type  | Wǔ Xíng | Shape signature                       | Core character/constitution                                                        |
| ---------- | ------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| Wood (木)  | Wood    | Long palm, long fingers, narrow.      | Visionary, idealistic, growth-oriented; liver/gallbladder constitutional emphasis. |
| Fire (火)  | Fire    | Long palm, short fingers, often pink. | Ardent, expressive, passionate; heart/small-intestine emphasis.                    |
| Earth (土) | Earth   | Square palm, short fingers, fleshy.   | Grounded, reliable, slow; spleen/stomach emphasis.                                 |
| Metal (金) | Metal   | Square palm, square fingers, bony.    | Disciplined, precise, just; lung/large-intestine emphasis.                         |
| Water (水) | Water   | Wide / oval palm, soft, often plump.  | Adaptive, intuitive, flowing; kidney/bladder emphasis.                             |

[Cross-verified across Zong & Liscum 1995 and multiple secondary sources. Specific element-to-organ attribution is straight Chinese-medicine *zàng-fǔ* (臟腑) doctrine — well-attested in *Huáng Dì Nèi Jīng*.]

Additional Five-Elements-school doctrines:

1. **Sān Hòu** (三候, "Three Periods" — past, present, future) — palm reading discloses temporal phases of fortune. (Referenced in Five Phase School texts; Zong & Liscum, 1995.)
2. **Sì Tōng** (四通, "Four Imports") — four major life-domain readings.
3. **Hand color, temperature, moisture, firmness** all read for _qì_ and _xuè_ (氣血) state. (Zong & Liscum, 1995, ch. 2.)
4. The classical Chinese-medical doctrine of **organ correspondence by finger** — thumb (lung), index (large intestine), middle (pericardium), ring (triple burner / sānjiāo), little (heart / small intestine on one face, kidney on the other). [Zong & Liscum, 1995 — derives from *Huáng Dì Nèi Jīng* meridian theory.]

**`karmic_supported: false`** — the Five Elements sub-style does **not** invoke past-life karma in its primary sources. It speaks of constitutional tendency, fortune-cycles (_sān hòu_), and Heaven-decreed _mìng_ (命, "fated life-allotment"), but **karma in the Indian / Buddhist sense is not a load-bearing concept here.** Chinese-Buddhist hybrid texts may invoke it, but a strict-tradition Five Elements reading should not. The AI must hold this line for tradition authenticity.

**Disallowed extensions specific to this sub-style.**

- Do not give a Western Ayurveda-style "dosha" reading. Wǔ Xíng ≠ tridoṣa.
- Do not deliver medical diagnosis from hand color. The classical text says _tendency_, _constitution_, never named disease.
- Do not invoke past-life karma in this sub-style.
- Do not blend in Bā Guà (eight-trigram) palace reading without switching sub-style.

---

### 2.2 Sub-style: Classical Ma Yi (麻衣) lineage

**Scope.** The Má Yī lineage descends from the legendary Daoist **Má Yī Dào-zhě** ("the Daoist in the Hempen Robe"), transmitted via Chén Tuán (d. 989 CE), and codified in the _Má Yī Shén Xiàng_ (麻衣神相). This is the most _cosmologically-saturated_ Chinese physiognomic-palmistric sub-style — it integrates face, body, hand, and skeletal structure into a single Daoist reading of _qì_, _jīng_, and _shén_ (氣 精 神).

**Primary text citations.**

- _Má Yī Shén Xiàng_ (麻衣神相) — Five Dynasties / early Song attribution; canonical text of the lineage. Cite with "attributed to Má Yī" hedge.
- Chén Tuán, _Shén Xiàng Quán Piān_ (神相全篇) — Song; primary transmission.
- Yuán Zhōngchè (compiler), _Shénxiàng Quánbiān_ (神相全編) — Ming; the principal transmission vehicle for Má Yī material into the late-imperial reading public. [Yuán Zhōngchè's compendium claims Chén Tuán as author, with Yuán Liǔ-zhuāng as transmitter — the chain Má Yī → Chén Tuán → Yuán is the canonical lineage narrative. Per Kohn, 1986.]
- _Liǔ Zhuāng Xiàng Fǎ_ (柳莊相法) by Yuán Zhōngchè — companion text.
- Cross-verification: Kohn, 1986; Kohn, 1988 ("Mirror of Auras: Chen Tuan on Physiognomy"); Wang, 2020.

**Core claims attestable from this sub-style's primary record.**

1. **Bone-physiognomy primacy.** The Má Yī lineage holds that **bone structure (gǔ 骨)** is more fundamental than flesh-mark observation. The hand's _bone_ skeleton matters first; lines and fleshly mounts are read against the bone substrate. [Wang, 2020; Kohn, 1986.]
2. **The age-zone doctrine (cross-verified, well-attested):** Má Yī taught that different bodily zones express different life-decades. Per the academic paper _Anthropometry in Ancient China Based on the Physiognomy Book of Divine Fortuneteller Ma Yi_: ears govern ages 1–14, nose 40–50, jaw the period after 60. The hand has its own age-zone mapping (palm zones for life decades) integrated with the _San Cai_ line system. [NEEDS CROSS-VERIFICATION on the exact hand-zone ages from the primary *Má Yī Shén Xiàng* text.]
3. **The triad jīng-qì-shén (精氣神).** The reader looks at the hand for _jīng_ (essence — visible in nail bed and palm color), _qì_ (vital energy — visible in palm warmth and skin tone), and _shén_ (spirit — visible in line clarity and overall hand "presence"). [Kohn, 1986, 1988.]
4. **Heart-as-root doctrine.** The Má Yī / Chén Tuán lineage holds, per the late-imperial _Collections of Chen Xiyi's Physiognomy_: **"The heart is the root of countenance, so by examining the heart one's morality is clear; deeds are the appearance of the heart, so by examining deeds one's luck is clear."** (Direct quotation as preserved in the _Collections_; cross-verified.) This is the doctrinal foundation that physiognomy is _not_ fatalism: the heart determines the face/hand, and moral cultivation can change the face/hand over time.
5. **Three-line San Cai mapping.** The heart line / head line / life line as Tiān-Rén-Dì (三才) is the Má Yī-lineage canonical reading.
6. **The reading is fundamentally _integrative_** — face, hand, gait, voice, skeletal frame are read as one body. The hand alone is _not_ sufficient. (Wang, 2020.)

**Tone-specific note.** The Má Yī lineage's voice is famously **declarative and Daoist-philosophical** — short epigrammatic statements, often cosmological in framing. (See §5 for examples.)

**`karmic_supported: partial` — `false` in strict primary doctrine, but the lineage uses Daoist language about "Heaven-decreed _mìng_" and "the fortune appointed by Heaven" that overlaps functionally with karma without invoking rebirth.** The AI may speak of "the _mìng_ allotted by Heaven" in this sub-style. The AI may **not** invoke past-life identity, the Buddhist _karma_ loop, or rebirth-specific language unless drawing on a syncretic Chinese-Buddhist source — and even then, only with explicit hedging.

**Disallowed extensions specific to this sub-style.**

- Do not import the specific **bagua palace** terminology of §2.3 — that is a different methodological branch.
- Do not claim past-life identities. The doctrine is _mìng_ (fated allotment), not rebirth-narrative.
- Do not give a face reading and call it Má Yī palm reading. The lineage is integrative but the AI's _output_ should stay in the requested modality.
- Do not give a martial-arts "Eight Trigram Palm" (Bāguàzhǎng 八卦掌) reference — that is a kung fu system, not a palmistry method, despite the lexical overlap.

---

### 2.3 Sub-style: Eight Trigrams (Bāguà 八卦) palmistry

**Scope.** The palm is divided into **eight palaces (八宮 bā gōng)**, each corresponding to one of the trigrams of the _Yì Jīng_ (易經). Each palace governs a life domain and reflects the corresponding trigram's elemental and directional symbolism. The center of the palm is a ninth zone — the **Míng Táng** (明堂, "Bright Hall"). Reading proceeds palace-by-palace.

**Primary text citations.**

- _Hé Luò Lǐ Shù_ (河洛理數, "Yellow River Principles & Numerology"), Song dynasty — first systematic mapping of the _xiān-tiān_ (先天, "Former Heaven") and _hòu-tiān_ (後天, "Later Heaven") arrangements of the bagua onto the palm. [As stated in: "Introduction to Chinese Medical Palmistry," healthy.net (secondary), citing the _Hé Luò Lǐ Shù_ attribution. Treat the attribution as **traditional** until confirmed against a critical edition. [NEEDS CROSS-VERIFICATION in primary.]]
- _Shénxiàng Quánbiān_ (Ming) — contains bagua-palace material as part of its compendium.
- The _Yì Jīng_ itself (predates all of the above; 9th–8th c. BCE traditionally, though the _Shí Yì_ commentary stratum is later) — provides the trigram symbolism upon which the palmistry rests.
- Cross-verification: Dukes, _Chinese Hand Analysis_, 1996 (treats the palace system in extended form); Zong & Liscum, 1995 (briefer treatment).

**Core claims attestable from this sub-style's primary record.**

The eight palaces of the palm (using the _hòu-tiān_ / Later Heaven arrangement, which is the standard for palmistry per the _Hé Luò Lǐ Shù_):

| Palace name                  | Trigram         | Element          | Direction                      | Palm location                                      | Life domain                                       |
| ---------------------------- | --------------- | ---------------- | ------------------------------ | -------------------------------------------------- | ------------------------------------------------- |
| **Qián gōng (乾宮)**         | ☰ Qián         | Heaven / Metal   | NW                             | Below the index finger / Jupiter mount area        | Father, authority, leadership, lineage            |
| **Kǎn gōng (坎宮)**          | ☵ Kǎn          | Water            | N                              | Base of palm centre / lower middle                 | Career, trials, hardship, hidden depth            |
| **Gèn gōng (艮宮)**          | ☶ Gèn          | Mountain / Earth | NE                             | Inner edge of palm, base of thumb-side             | Children, real estate, change, stillness          |
| **Zhèn gōng (震宮)**         | ☳ Zhèn         | Thunder / Wood   | E                              | Middle of thumb-side palm edge                     | Elder brothers, initiative, reputation, shock     |
| **Xùn gōng (巽宮)**          | ☴ Xùn          | Wind / Wood      | SE                             | Below middle finger / Saturn area                  | Wealth, influence, gentle penetration             |
| **Lí gōng (離宮)**           | ☲ Lí           | Fire             | S                              | Top of palm / Sun (ring-finger) base               | Fame, recognition, illumination                   |
| **Kūn gōng (坤宮)**          | ☷ Kūn          | Earth            | SW                             | Below little-finger inner edge / Mercury-Mars area | Mother, marriage, receptivity                     |
| **Duì gōng (兌宮)**          | ☱ Lake / Metal | W                | Below little finger outer edge | Speech, joy, younger sister, social success        |
| **Míng Táng (明堂, center)** | —               | —                | center                         | Hollow of palm                                     | The total life pattern; reflects the whole person |

[Mapping cross-verified between Dukes, 1996; Zong & Liscum, 1995; multiple Chinese-language secondary references. The exact location-to-palace correspondences vary by lineage by ~1 finger-width; the AI should not over-precision the boundaries. The above is the *standard mid-palm* layout.] [NEEDS CROSS-VERIFICATION] for primary-verse confirmation of the **specific** locations.

Reading principles:

1. **A palace is read by its fullness, color, line activity, and any special marks within it.** A _full and well-colored_ Qián palace, for instance, indicates strong paternal lineage and authority. A _broken_ Lí palace suggests setbacks in fame and recognition. (Dukes, 1996; Zong & Liscum, 1995.)
2. **Lines crossing from one palace to another** transmit influence between the corresponding life domains. (Dukes, 1996.)
3. **The Míng Táng** (palm centre hollow) is the **integrator** — a deep, well-formed Míng Táng indicates a coherent life pattern; a flat or mark-disrupted Míng Táng indicates fragmentation. (Dukes, 1996; multiple secondary.)
4. **Trigram symbolism is honored in interpretation.** Lí (☲, Fire) palace problems read as illumination/fame issues, _not_ as cardiovascular issues — the latter is a Five Elements-school move (§2.1) and would be an inappropriate cross-style import.

**`karmic_supported: false`** — the bagua palmistry sub-style operates in _Yì Jīng_ cosmology, which is fundamentally about **change patterns and configuration** (_biàn yì_ 變易), not karma. The AI in this sub-style should speak in the language of _configuration_, _pattern_, _mìng_ (Heaven-allotted destiny) — never past-life karma.

**Disallowed extensions specific to this sub-style.**

- Do not import five-element organ-correspondence claims into a bagua reading. The bagua reading is about _life domains and configurations_, not viscera.
- Do not confuse this with Bāguàzhǎng (八卦掌), the martial art "Eight Trigrams Palm." Lexical false friend.
- Do not claim a palace's "destiny" is fixed. The _Yì Jīng_ is the book of _change_; any palace reading must include the doctrine of _biàn_ (change).
- Do not use this sub-style for very young children — the bagua palaces stabilize with adulthood; children's palms are read with caveats in the classical record.

---

## 3. Shared anatomical / observational vocabulary

This section lists features the AI may _observe_ in any tradition, with the **caveat that interpretation must remain inside the active tradition**. Cross-tradition equivalences are listed only where the canonical sources themselves cross-reference. They do not, for the most part, cross-reference. The default is **separate**.

### Hand shape

| Feature            | Indian (Sanskrit)                                | Chinese                  | Shared observational term |
| ------------------ | ------------------------------------------------ | ------------------------ | ------------------------- |
| Long-narrow hand   | (no fixed Sanskrit; described per finger length) | Wood (木) hand           | "Long-fingered hand"      |
| Square hand        | —                                                | Earth (土) / Metal (金)  | "Square-palmed hand"      |
| Soft / plump hand  | "soft hand" (Sen, 1960)                          | Water (水) hand          | "Soft hand"               |
| Conical / tapering | "conical fingertips" (Sen, 1960)                 | (less doctrinally fixed) | "Conical-tipped hand"     |

> **Observational layer only.** Both traditions notice a "long, narrow, soft hand," but the Indian planetary reading (Moon-mount dominance) and the Chinese Five Phase reading (Water type) say _different things_. The AI must interpret per active tradition.

### Finger nomenclature

| Finger | Indian (planetary)                  | Chinese (organ-meridian, per _Huáng Dì Nèi Jīng_)                         |
| ------ | ----------------------------------- | ------------------------------------------------------------------------- |
| Thumb  | (governing) — Will / discrimination | Lung (太陰肺經)                                                           |
| Index  | Jupiter (Guru)                      | Large intestine (陽明大腸經)                                              |
| Middle | Saturn (Śani)                       | Pericardium (厥陰心包經)                                                  |
| Ring   | Sun / Apollo (Sūrya)                | Sānjiāo / Triple burner (少陽三焦經)                                      |
| Little | Mercury (Budha)                     | Heart / Small intestine / Kidney faces (少陰心經 / 太陽小腸經 / 少陰腎經) |

### Lines (the major three)

| Line (English) | Indian Sanskrit         | Chinese         | Cosmological role                                                                             |
| -------------- | ----------------------- | --------------- | --------------------------------------------------------------------------------------------- |
| Heart line     | Hṛdaya rekhā            | Tiān wén (天紋) | Indian: Mercury-Mount-edge → Jupiter-Mount-edge, emotional life. Chinese: Heaven-line, upper. |
| Head line      | Mastiṣka / Buddhi rekhā | Rén wén (人紋)  | Indian: intellect. Chinese: Human-line, middle.                                               |
| Life line      | Āyu / Jīvana rekhā      | Dì wén (地紋)   | Indian: vitality, life span. Chinese: Earth-line, lower.                                      |

> **The line _names_ differ; the _position-on-palm_ mapping differs only in nomenclature, not geometry.** This is the sole significant convergence point between the traditions and is not a license to blend interpretation.

### Mounts vs. palaces — DO NOT BLEND

The Indian system uses **nine planetary mounts** (Jupiter, Saturn, Sun, Mercury, Mars-upper, Mars-lower, Moon, Venus, plus context-dependent Rāhu/Ketu).
The Chinese bagua system uses **eight trigram palaces plus a centre Míng Táng** (nine total zones).

Both systems use roughly the same _anatomical_ surface of the palm but assign **different meanings**. The AI must never treat "Mount of Jupiter" and "Qián palace" as equivalent. They share approximate physical location but symbolize different cosmologies.

---

## 4. Disallowed extensions (consolidated)

These are claims commonly made in pop-culture palmistry that are **NOT supported by the primary classical sources of either tradition.** The AI must refuse these regardless of which tradition is active.

1. **Exact date of death.** Sen, 1960 explicitly: "the masters do not permit" predictions of death; "the exact span of a life [is] the one thing above all else that Providence appears to have jealously hidden from the ken of man." Chinese tradition similarly hedges via the _biàn_ (change) doctrine.
2. **Specific tragedy predictions** — "a car accident in November," "a fall from a horse," "death of a named person." Neither Sanskrit nor Chinese primary texts authorize this granularity. They speak in _tendencies_ and _life-period configurations_.
3. **Specific medical diagnoses.** Both traditions speak of _constitutional tendency_ (Indian: planetary dosha-like inclination; Chinese: Wǔ Xíng / _zàng-fǔ_ tendency), never named disease.
4. **Lottery / gambling outcome predictions.** Absent from all primary classical sources.
5. **Past-life identity** ("you were Cleopatra"). The Indian doctrine speaks of _karmic tendency_ (saṃskāra) inherited from past lives, never a specific named identity. The Chinese doctrine does not invoke past lives at all in the strict-tradition primary record.
6. **Cross-tradition blending.** Reading an Indian Mount of Jupiter as a Qián palace, or applying Five Phase organ-correspondence to a Bagua palmistry reading, is unsupported in the primary record. **This is treated as an unsafe output.**
7. **Westernized "soulmate" / "twin flame" / "karmic relationship" New Age language** — none of this terminology exists in the primary record. The Indian record speaks of _vivāha_ / marriage suitability and _santāna_ / progeny; the Chinese record speaks of marriage palace (Kūn) configuration and _yīn-yáng_ harmony.
8. **Cheiro / Count Louis Hamon-derived claims presented as Indian** — Cheiro's system is explicitly _excluded_ by this project's brief. Western synthesis ≠ classical Indian palmistry.
9. **Astrological-blog claims about specific planet-house combinations** that do not appear in Jyotiṣa primary sources. Stay with classical _kārakatva_.
10. **Claims that lines are completely fixed.** Sen, 1960: "Under the influence of a strong will the lines of the palm undergo changes corresponding to the altered life of the person." Chen Tuan / Má Yī lineage: "the heart is the root of countenance" — the inner life shapes the outer signs. **Both traditions explicitly preserve some agency.**
11. **Claims that lines are completely free** (i.e., that hand markings are pure self-expression with no destiny content). Both traditions affirm that the hand encodes inherited tendency. The truthful position is _tendency, not determinism_.
12. **"Tarot-style" specific scenario predictions** ("you will receive an unexpected letter from a man in a blue coat"). No primary source authorizes this specificity.
13. **Naming exact ages for events with single-year precision.** Time-mapping schemes in both traditions are approximate (decade-bracket).
14. **Pseudepigraphal source citation without hedge.** When citing _Ravaṇa Saṃhitā_, _Gārga Saṃhitā_ (the physiognomy attribution, not the Vaishnava devotional text), or any "Daoist Hempen-Robe / Má Yī" attribution as if a stable critical edition exists, the AI must say "tradition attributes…" or equivalent.
15. **Health claims that cross from constitutional tendency into diagnosis or treatment recommendation.** Neither Sanskrit nor Chinese primary sources authorize the AI to prescribe.
16. **Reading hands of children under ~12 with adult-life specificity.** Both traditions hedge here. Children's palms are still forming.
17. **Reading photographs of unclear quality with confidence.** The classical reader is _physically present_. Photographic reading is a modern accommodation and must carry an epistemic hedge.

---

## 5. Tone and language conventions

This section gives the AI a model of how a master practitioner _actually_ phrased findings in the classical record. The voice is **declarative, observational, decisive, and rooted in named features**, not "channeled" or vague.

### Indian (Hasta Sāmudrika) cadence — direct examples

From K. C. Sen, _Hast Samudrika Shastra_, 1960 (which preserves the classical declarative style in English translation):

> **"Straight fingers indicate a fortunate person."**
> _(Two-clause declarative. Condition → conclusion. No softening, no qualification.)_

> **"If the little finger is nearly as long as the third, it is the mark of a savant and philosopher."**
> _(Conditional observation with definitive conclusion. Specific anatomical observation → specific character claim.)_

> **"Under the influence of a strong will the lines of the palm undergo changes corresponding to the altered life of the person."**
> _(Doctrinal sentence. Note the agency-preserving frame — destiny is read but not closed.)_

> **"When [the conch mark] is present, it denotes a millionaire."**
> _(Sign → significance. Compact, confident.)_

**Indian voice rules for the AI:**

- Speak in _short, clear, declarative sentences_.
- Lead with the observation, follow with the meaning.
- Hedge only where the classical text itself hedges (children's lines, exact span of life, specific years).
- Quote Sanskrit terms with translation, e.g., "the _matsya-cihna_ — the fish mark — appears here, and it denotes…"
- Reference the planetary attribution where relevant: "the Mount of Jupiter (_Guru parvata_) is full and well-formed; this is the sign of a leader."

### Chinese (Má Yī / _Shénxiàng_ lineage) cadence — direct examples

From the Chen Tuan / Má Yī tradition, as preserved in the late-imperial _Collections of Chen Xiyi's Physiognomy_ (cited in Kohn, 1986):

> **"The heart is the root of countenance, so by examining the heart one's morality is clear; deeds are the appearance of the heart, so by examining deeds one's luck is clear."**
> _(Cosmological–ethical sentence. Note the parallelism: heart-countenance, deeds-luck. This is the Chinese physiognomic voice — short parallel clauses, philosophical, tied to the moral order.)_

From the _Bīng Jiàn_ of Zēng Guófān (Qing, 1811–1872) — a pragmatic, talent-evaluation cadence:

> _(Paraphrased per its traditional structure)_ **"Look first at the spirit and bone; the flesh is secondary. The eye is master; the rest serves."**
> [NEEDS CROSS-VERIFICATION for verbatim translation; the structural pattern (rank-ordered observation, master-and-servant grammar) is well-attested in *Bīng Jiàn* secondary scholarship.]

**Chinese voice rules for the AI:**

- Speak in **short parallel clauses** where appropriate — Chinese physiognomic prose loves balanced pairs (qì/xíng, gǔ/ròu, shén/sè).
- Lead with the **most fundamental layer** (bone or spirit) before the surface.
- Quote Chinese terms (with pinyin and characters) when they have no clean English equivalent: _qì_ (氣, vital energy), _shén_ (神, spirit), _mìng_ (命, allotment).
- Anchor in cosmology — _Tiān-Rén-Dì_, _Yīn-Yáng_, _Wǔ Xíng_, or _Bāguà_ depending on sub-style.
- Use the _biàn_ (change) doctrine to soften any claim that sounds fixed.

### What both cadences share — and what to avoid

**Share:** decisiveness, specificity to observed feature, integration with a larger cosmology, explicit room for human agency / moral cultivation.

**Avoid:**

- Floaty mystical language ("the energies of your soul are vibrating…").
- Therapeutic / coaching register ("I sense you may be struggling with…").
- Tarot-style scenario language ("a stranger will enter your life…").
- Deferential modern hedging ("perhaps it might be that possibly…"). The classical voice is _not_ hedging — it is _specifying_.
- New Age compound-noun phrases ("soul contract," "vibrational alignment," "lightworker," "starseed"). None of these are in the primary record of either tradition.

---

## 6. Sources bibliography (full)

### Indian — primary classical (text)

- **Varāhamihira.** _Bṛhat Saṃhitā_. ca. 6th c. CE. Sanskrit. Critical English edition consulted: Panditbhushan V. Subrahmanya Sastri & Vidwan M. Ramakrishna Bhat, eds. _Varahamihira's Brihat Samhita_. V. B. Soobbiah & Sons, M.B.D. Electric Printing Works, 1946. (Internet Archive: archive.org/details/VarahamihirasBrihatSamhitaByVSubrahmanyaSastri.)
- **Durlabharāja & Jagaddeva.** _Sāmudrika-tilaka_ (originally _Nara-lakṣaṇa-śāstra_). ca. 1160 CE. Sri Venkateswar Steam Press edition, 1954.
- **Madhava Śrī-grāma-kāra.** _Sāmudrika-cintāmaṇi_. ca. 1700 CE.
- **Meghavijayagaṇi.** _Hasta-Sañjīvanī_ and _Jaina Sāmudrika_. Late 17th c.
- **Anonymous.** _Sāmudrika-lakṣaṇa_ (Sanskrit-to-Hindi). 1507 CE. Earliest translated Indian-palmistry manuscript.
- **Pseudepigraphal** (cite with hedge): _Ravaṇa Saṃhitā_, _Gārga Saṃhitā_ (the physiognomy attribution), _Hasta-Cihna-Sūtra_, _Kara-rekhā-prakaraṇa_, _Sāmudrika-bhūṣaṇa_, _Naṣṭa-jātaka_.

### Indian — primary classical (text), Tamil / South

- _Sāmudrika_ manuscripts at the Government Oriental Manuscripts Library, Chennai. (Inventory only; specific edition consultation flagged for human follow-up.)
- _Sārīraka Śāstra_ (Kārtikeyan system), trans. V. A. K. Ayer, 1960.

### Indian — modern reputable scholar / scholar-practitioner

- **Sen, K. C.** _Hast Samudrika Shastra: The Indian Science of Hand Reading_. Bombay: D. B. Taraporevala Sons & Co. Private Ltd., 1960. (Internet Archive: archive.org/details/in.ernet.dli.2015.125592.)
- **Ayer, V. A. K.** _Palmistry for Pleasure and Profit: How the Hand is Commonly Read in India and the West_. Bombay: D. B. Taraporevala Sons & Co., 1962.
- **Mason, Andrew.** _Vedic Palmistry: Hastā Rekhā Śāstra_. London / Philadelphia: Singing Dragon (Jessica Kingsley Publishers), 2017. ISBN 9781848193505.

### Indian — reference / tertiary

- "Samudrika Shastra." _Wikipedia_, retrieved 2026. (en.wikipedia.org/wiki/Samudrika_Shastra.)
- Wisdomlib, _Brihat Samhita_ index. (wisdomlib.org/hinduism/book/brihat-samhita.)
- Wisdomlib, _Sāmudrikaśāstra_ definition entry. (wisdomlib.org/definition/samudrikashastra.)

### Chinese — primary classical (text)

- **Wáng Chōng (王充).** _Lùn Héng_ (論衡), containing _Gǔ Xiàng / Gǔ Gé Piān_ (骨相 / 骨格篇). Han dynasty, late 1st – early 2nd c. CE.
- **Cháo Yuán-fāng (巢元方).** _Zhū Bìng Yuán Hòu Zǒng Lùn_ (諸病源候總論). Sui dynasty, 610 CE. Medical hand-diagnosis (_shǒu zhěn_).
- **Lái Hé (來和).** _Xiàng Jīng Shí Sì Juàn_ (相經十四卷). Sui dynasty.
- **Lǚ Dòng-bīn (呂洞賓) attribution.** _Xiàng Fǎ Rù Mén_ (相法入門). Tang dynasty. Pseudepigraphal — hedge.
- **Chén Tuán (陳摶, d. 989 CE).** _Shén Xiàng Quán Piān_ (神相全篇). Song dynasty.
- **Wáng Bó (王朴).** _Tài Qīng Shén Jiàn_ (太清神鑑). Song dynasty.
- **Attributed to Má Yī Dào-zhě (麻衣道者).** _Má Yī Shén Xiàng_ (麻衣神相) / _Má Yī Xiàng Fǎ_ (麻衣相法). Late Five Dynasties / early Song. Foundational text of the Má Yī lineage.
- **Hé Luò Lǐ Shù (河洛理數).** Song dynasty. Bagua-palm mapping. [NEEDS CROSS-VERIFICATION] of authorship and edition.
- **Yuán Zhōngchè (袁忠徹) (1367–1458).** _Liǔ Zhuāng Xiàng Fǎ_ (柳莊相法) and (compiler of) _Shénxiàng Quánbiān_ (神相全編). Early-to-mid Ming. Reprinted in _Gǔjīn Tūshū Jíchéng_ (古今圖書集成), chs. 631–644.
- **Zēng Guófān (曾國藩) (1811–1872).** _Bīng Jiàn_ (冰鑑) — "Ice Mirror." Qing dynasty. English translation: _Ice Identification: Bing Jian — A Textbook to Identify and Select Talents in Ancient China_. Available editions cited on Google Books / Kobo.

### Chinese — modern reputable scholarly

- **Kohn, Livia.** "A Textbook of Physiognomy: The Tradition of the _Shenxiang quanbian_." _Asian Folklore Studies_ 45.2 (1986): 227–258. JSTOR 1178619. (Article landing page: asianethnology.org/article/1431.)
- **Kohn, Livia.** "Mirror of Auras: Chen Tuan on Physiognomy." _Asian Folklore Studies_ 47 (1988). (asianethnology.org/article/1317.)
- **Wang, Xing.** _Physiognomy in Ming China: Fortune and the Body_. Sinica Leidensia 152. Leiden: Brill, 2020. (brill.com/display/title/57079; published Oxford D.Phil. dissertation: ora.ox.ac.uk/objects/uuid:b6da1b53-e50d-425e-97b3-4f77eb071580.)
- **Homola, Stéphane.** _The Art of Fate Calculation: Practising Divination in Taipei, Beijing, and Kaifeng_. Berghahn Books, 2023. (berghahnbooks.com — introductory chapter PDF consulted.)
- **Zong, Xiao-Fan & Liscum, Gary.** _Chinese Medical Palmistry: Your Health in Your Hand_. Boulder: Blue Poppy Press, 1995. ISBN 0-936185-64-3.
- **Dukes, Terence.** _Chinese Hand Analysis_. Selangor Darul Ehsan: Pelanduk Publications, 1996. ISBN 978-967-978-248-6. (Internet Archive: archive.org/details/chinesehandanaly0000duke.) [Treat as comprehensive secondary; verify specific claims against Kohn / Wang.]
- **(Author unidentified in this pass.)** _Anthropometry in Ancient China Based on the Physiognomy Book of Divine Fortuneteller Ma Yi_. Atlantis Press / SSCHD-16 conference proceedings. (atlantis-press.com/proceedings/sschd-16/25860584.) [NEEDS CROSS-VERIFICATION] for full citation.

### Chinese — reference / tertiary

- "Chinese fortune telling." _Wikipedia_, retrieved 2026. (en.wikipedia.org/wiki/Chinese_fortune_telling.)
- "Chen Tuan." _Wikipedia_, retrieved 2026.
- "Five Arts of Chinese Metaphysics." mountain-u.org. [Tertiary — for context only.]
- "Introduction to Chinese Medical Palmistry." healthy.net, December 6, 2000. [Tertiary — used to surface primary-text names that were then cross-checked.]
- "Ma Yi Shen Xiang Fa." Wisdomlib definition entry. (wisdomlib.org/definition/ma-yi-shen-xiang-fa.)

### Cross-tradition / comparative

- "Palmistry." _Wikipedia_, retrieved 2026. (Used only for the cross-tradition handedness convention and other widely-replicated factual claims.)

---

## 7. Verification status and known gaps

### Confirmed and ready to cite

- The bibliographic existence and dating of all primary texts listed above.
- The high-level structural claims of each tradition (planetary mounts in Indian; San Cai lines and bagua palaces in Chinese; Wǔ Xíng hand types in Chinese).
- The handedness convention (Indian: M-right / F-left; Chinese: M-left / F-right) — well-attested in secondary, not yet in primary verse.
- The Sen 1960 direct quotations (these are quoted from Sen's _English_ text, which is the highest-rigor English-medium Indian-palmistry source consulted).
- The Má Yī lineage age-zone face doctrine (academic paper attestation).
- The Chen Tuan / _Collections of Chen Xiyi's Physiognomy_ "heart is the root of countenance" passage.

### `[NEEDS CROSS-VERIFICATION]` — flagged items requiring human follow-up

1. **Bṛhat Saṃhitā chapter 68 verbatim verses on hand features** — the 1946 Subrahmanya Sastri edition contains the chapter on p. 542; the verses themselves were not extracted in this pass. Required for any verse-level Sanskrit citation.
2. **Sen 1960 individual claims** ("straight fingers indicate a fortunate person," "little finger as long as ring → savant") — present in Sen but not yet traced to a _named Sanskrit verse origin_. They may be Sen's synthesis; flag accordingly.
3. **Sāmudrika-tilaka critical-edition consultation** — the 1954 Venkateswar edition exists but its specific palm-content has not been verbatim cross-checked.
4. **Specific bagua palace location boundaries** in primary _Hé Luò Lǐ Shù_ / _Shénxiàng Quánbiān_. Cross-lineage variation noted in the secondary literature but not pinned down.
5. **Rāhu / Ketu palm-mount mapping** in Indian primary sources — Mason 2017 attests this but the older classical record is less clear.
6. **North vs. South Indian doctrinal divergences** at the level of specific line meanings — secondary literature notes textual-transmission differences, not clear doctrinal contradictions. Flag for a Sanskritist's review.
7. **Bīng Jiàn verbatim translations** — the structural rules of Zeng Guofan's text are well-attested but specific verbatim English-text quotations were not pinned in this pass.
8. _Anthropometry in Ancient China Based on the Physiognomy Book of Divine Fortuneteller Ma Yi_ — full bibliographic citation (author, year, page) was not extracted; flagged.

### Sources excluded by project brief (do NOT cite as authoritative)

- **Cheiro / Count Louis Hamon** — explicitly excluded as Western synthesis.
- **Lal Kitab as Indian palmistry primary** — Lal Kitab is a 20th-century Punjabi astrology / remedy text, not classical Sanskrit Hasta Sāmudrika; appears in some hybrid modern works (e.g., _Astro Palmistry_) but is not a primary palmistry source for this project.
- **SEO / blog content with no scholarly apparatus** — vedictraditions.com, askganesha.com, jyotishvidya.co.in, vocal.media, mysticryst.com, ferrymanstudio.com, wofs.com, chinaeducationaltours.com, hellochinatrip.com, serenapowers.com, mastertsai.com, etc. were used **only** to triangulate primary-text names that were then cross-checked, and never as authoritative citations.
- **Generic Chinese-astrology repackaging** that conflates Bāzì, Zǐwēi Dòushù, and palmistry without distinguishing.
- **AI-generated summaries / Grokipedia / Medium-style essays** — none cited as primary or verified secondary.

### Provisional source — to be replaced when a stronger primary-text quotation is available

- **N. L. Desai, "History and Origin of Palmistry," Saptarishis Astrology** (online) — used as a _naming_ source for several minor Indian primary-text titles (_Hasta-Cihna-Sūtra_, _Kara-rekhā-prakaraṇa_, _Viveka Vilas_, _Sāmudrika-bhūṣaṇa_, _Naṣṭa-jātaka_). These titles are corroborated in the Wikipedia _Samudrika Shastra_ manuscript-inventory entry. Treat as confirmed-by-cross-reference for _titles_; specific _content_ claims drawn from these titles must be re-verified against the actual manuscripts.

---

_End of /docs/research.md._
