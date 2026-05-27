import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, Download, Check, RotateCcw, Shuffle, Compass, Layers, FileText, GripVertical, ChevronUp, ChevronDown, Bug, Bird, Flower, Shell, TreePine, Skull, Footprints, RefreshCw, Sprout, Snail, Fish, Lock } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// DATA — Module 1: The Nature of Geology
// ─────────────────────────────────────────────────────────────

const KEY_TERMS = [
  { term: "Geology", definition: "The study of the Earth, its materials, and the processes acting upon them." },
  { term: "Physical Geology", definition: "The branch of geology concerned with the physical features and processes of the Earth." },
  { term: "Historical Geology", definition: "The branch of geology that deals with the history of the Earth as recorded in rocks." },
  { term: "Earth Systems", definition: "The interconnected systems that make up the Earth, including the atmosphere, hydrosphere, biosphere, and geosphere." },
  { term: "Hydrosphere", definition: "The water component of the Earth, including oceans, lakes, rivers, and groundwater." },
  { term: "Atmosphere", definition: "The layer of gasses surrounding the Earth, held by gravity." },
  { term: "Biosphere", definition: "The regions of the Earth where living organisms exist." },
  { term: "Geosphere", definition: "The solid part of the Earth, including the crust, mantle, and core." },
  { term: "Uniformitarianism", definition: "The principle that the same natural laws and processes that operate in the universe now have always operated in the universe and apply everywhere in the universe." },
  { term: "Hypothesis", definition: "A proposed explanation for a phenomenon, which can be tested through experimentation and observation." },
  { term: "Theory", definition: "A well-substantiated explanation of some aspect of the natural world, based on a body of evidence." },
];

const READINGS = [
  {
    title: "Chapter 1: An Introduction to Geology",
    sections: "Section 1.5 (Origin and Early Evolution of Earth) · Section 1.6 (Earth's Internal Structure)",
    pages: "pp. 21–23",
    ppt: "01_earth13_lecture_ppt",
    questions: [
      "How do the different stages of solar system formation relate to the current arrangement and characteristics of planets we observe today?",
      "In what ways does Earth's internal structure influence surface phenomena such as plate tectonics, volcanism, and earthquakes?",
    ],
  },
  {
    title: "Chapter 1: An Introduction to Geology",
    sections: "Section 1.3 (The Nature of Scientific Inquiry)",
    pages: "pp. 11–12",
    ppt: "01_earth13_lecture_ppt",
    questions: [
      "How does the process of developing and testing hypotheses in geology differ from or resemble the scientific method used in other natural sciences?",
      "What unique challenges might geologists face in this process?",
    ],
  },
  {
    title: "Chapter 1: An Introduction to Geology",
    sections: "Section 1.4 (Earth as a System)",
    pages: "pp. 13–16",
    ppt: null,
    questions: [
      "How might a change in one of Earth's spheres potentially affect the others? Can you think of a specific example to illustrate this interconnectedness?",
      "In what ways do humans interact with and influence each of Earth's four major spheres? Consider both positive and negative impacts.",
    ],
  },
];

const SK = (k) => `geol1403:m1:${k}`;

// ─────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────

const useStored = (key, defaultValue = '') => {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(key);
        if (result?.value !== undefined) {
          try { setValue(JSON.parse(result.value)); } catch { setValue(result.value); }
        }
      } catch (e) { /* not set yet */ }
      setLoaded(true);
    })();
  }, [key]);

  const save = useCallback((newValue) => {
    setValue(newValue);
    if (!loaded) return;
    setSaveState('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const toStore = typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
        await window.storage.set(key, toStore);
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 1200);
      } catch (e) { setSaveState('idle'); }
    }, 600);
  }, [key, loaded]);

  return [value, save, saveState];
};

// ─────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────

const PaperField = ({ storageKey, placeholder, rows = 3, label }) => {
  const [value, save, saveState] = useStored(storageKey);
  return (
    <div className="relative my-3">
      {label && (
        <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-1.5 font-medium">
          {label}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => save(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-[#FDFBF4] border border-stone-300/60 rounded-sm focus:outline-none focus:border-[#8B4513] focus:bg-white transition-colors resize-y text-stone-800 leading-relaxed"
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: '15px',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(139, 69, 19, 0.06) 27px, rgba(139, 69, 19, 0.06) 28px)',
          lineHeight: '28px',
        }}
      />
      <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-stone-400 transition-opacity"
        style={{ opacity: saveState === 'idle' ? 0 : 1 }}>
        {saveState === 'saving' ? '…saving' : '✓ saved'}
      </div>
    </div>
  );
};

const SectionHeader = ({ number, title, icon: Icon }) => (
  <div className="flex items-baseline gap-4 mb-6 pb-3 border-b-2 border-stone-800">
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className="text-[#8B4513] -mb-1" strokeWidth={1.5} />}
      <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
        §{number}
      </span>
    </div>
    <h2 className="text-2xl tracking-tight text-stone-900" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}>
      {title}
    </h2>
  </div>
);

const MetacogPrompt = ({ children, storageKey }) => (
  <div className="mb-6">
    <div className="flex gap-3 mb-2">
      <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>→</span>
      <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
        {children}
      </p>
    </div>
    <div className="ml-6">
      <PaperField storageKey={storageKey} placeholder="Your reflection…" rows={3} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// FLASHCARD
// ─────────────────────────────────────────────────────────────

const Flashcard = ({ term, definition, index, mastered, onToggleMastered }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative" style={{ perspective: '1000px', minHeight: '160px' }}>
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative w-full h-full cursor-pointer transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '160px',
        }}
      >
        {/* Front — term */}
        <div
          className="absolute inset-0 rounded-sm border border-stone-300 p-4 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #FDFBF4 0%, #F5EFE0 100%)',
            boxShadow: '2px 3px 0 rgba(60, 40, 20, 0.08)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
              {String(index + 1).padStart(2, '0')} / 11
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleMastered(); }}
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm transition-colors ${
                mastered
                  ? 'bg-[#4A5D3F] text-[#FAF6EE]'
                  : 'border border-stone-300 text-stone-500 hover:border-stone-500'
              }`}
            >
              {mastered ? '✓ known' : 'mark known'}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-xl text-center text-stone-900 leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
              {term}
            </h3>
          </div>
          <div className="text-[10px] text-stone-400 text-center italic">tap to reveal</div>
        </div>
        {/* Back — definition */}
        <div
          className="absolute inset-0 rounded-sm border border-stone-300 p-4 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #2C2A26 0%, #3D3631 100%)',
            color: '#FAF6EE',
            boxShadow: '2px 3px 0 rgba(60, 40, 20, 0.08)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
              {term}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-stone-400">def.</span>
          </div>
          <div className="flex-1 flex items-center">
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
              {definition}
            </p>
          </div>
          <div className="text-[10px] text-stone-500 text-center italic">tap to flip back</div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────

const KeyTermsSection = () => {
  const [masteredList, setMasteredList] = useStored(SK('terms:mastered'), []);
  const [shuffled, setShuffled] = useState(false);
  const [order, setOrder] = useState(KEY_TERMS.map((_, i) => i));

  const masteredSet = new Set(masteredList);

  const toggleMastered = (term) => {
    const next = masteredSet.has(term)
      ? masteredList.filter(t => t !== term)
      : [...masteredList, term];
    setMasteredList(next);
  };

  const shuffle = () => {
    const newOrder = [...order].sort(() => Math.random() - 0.5);
    setOrder(newOrder);
    setShuffled(true);
  };

  const reset = () => {
    setOrder(KEY_TERMS.map((_, i) => i));
    setShuffled(false);
  };

  const progress = masteredSet.size;
  const total = KEY_TERMS.length;

  return (
    <section className="mb-16">
      <SectionHeader number="01" title="Key Terms" icon={Layers} />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-stone-700 max-w-2xl leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
          Eleven foundational terms for this module. Tap a card to flip it. Mark terms you already know
          to track your progress through the module's vocabulary.
        </p>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Known</div>
            <div className="text-2xl text-stone-900" style={{ fontFamily: "'Fraunces', serif" }}>
              {progress}<span className="text-stone-400 text-lg">/{total}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={shuffle}
              className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-stone-400 text-stone-700 hover:bg-stone-800 hover:text-[#FAF6EE] transition-colors flex items-center gap-1.5"
            >
              <Shuffle size={11} /> shuffle
            </button>
            {shuffled && (
              <button
                onClick={reset}
                className="text-[11px] uppercase tracking-wider px-3 py-1.5 text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={11} /> reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#4A5D3F] transition-all duration-500"
          style={{ width: `${(progress / total) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {order.map((idx) => (
          <Flashcard
            key={KEY_TERMS[idx].term}
            index={idx}
            term={KEY_TERMS[idx].term}
            definition={KEY_TERMS[idx].definition}
            mastered={masteredSet.has(KEY_TERMS[idx].term)}
            onToggleMastered={() => toggleMastered(KEY_TERMS[idx].term)}
          />
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-stone-200">
        <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">
          Reflect on your vocabulary
        </h3>
        <MetacogPrompt storageKey={SK('vocab:reflect:challenging')}>
          Were there any words or definitions that you found particularly challenging? If so, which ones and why?
        </MetacogPrompt>
        <MetacogPrompt storageKey={SK('vocab:reflect:overcome')}>
          How did you overcome these challenges?
        </MetacogPrompt>
      </div>
    </section>
  );
};

const OverviewSection = () => (
  <section className="mb-16">
    <SectionHeader number="02" title="Module Overview & Goals" icon={Compass} />

    <div className="mb-8 p-5 bg-[#F5EFE0]/60 border-l-4 border-[#8B4513] rounded-r-sm">
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#8B4513] mb-3 font-semibold">
        Before you begin
      </h3>
      <ul className="space-y-1.5 text-stone-800" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
        <li>· Preview Module 1 in the course</li>
        <li>· Review the Module Overview page and Learning Activities list</li>
        <li>· Scan each page of the module</li>
        <li>· Complete the Metacognitive Moment below</li>
      </ul>
    </div>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">
      Metacognitive Moment
    </h3>

    <MetacogPrompt storageKey={SK('overview:prior_knowledge')}>
      Based on the Module Overview, what do you already know about this topic?
    </MetacogPrompt>

    <MetacogPrompt storageKey={SK('overview:time_needed')}>
      How much time will you need to complete this module?
    </MetacogPrompt>

    <MetacogPrompt storageKey={SK('overview:motivation')}>
      How can I motivate myself to do the module activities and assignments to the best of my ability?
    </MetacogPrompt>

    <div className="mt-8">
      <PaperField
        storageKey={SK('overview:goals')}
        label="My personal learning goals for this week"
        placeholder="Write your goals here…"
        rows={4}
      />
    </div>

    <div className="mt-4">
      <PaperField
        storageKey={SK('overview:learning_path')}
        label="My learning path for Module 1 (days/times scheduled)"
        placeholder="e.g. Mon 7–8pm: readings · Wed 6–7pm: activities · Fri: quiz prep…"
        rows={3}
      />
    </div>
  </section>
);

const ReadingsSection = () => (
  <section className="mb-16">
    <SectionHeader number="03" title="Reading Notes & Key Questions" icon={BookOpen} />

    <p className="mb-8 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
      For each reading below, capture your notes and respond to the key questions in your own words.
    </p>

    {READINGS.map((reading, i) => (
      <div key={i} className="mb-10 pb-8 border-b border-stone-200 last:border-0">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">
            Reading {i + 1} of {READINGS.length}
          </div>
          <h3 className="text-lg text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
            {reading.title}
          </h3>
          <p className="text-sm text-stone-600 italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
            {reading.sections} · {reading.pages}
            {reading.ppt && ` · ${reading.ppt}`}
          </p>
        </div>

        <PaperField
          storageKey={SK(`readings:notes:${i}`)}
          label="Reading notes"
          placeholder="Notes from this reading…"
          rows={4}
        />

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2 font-medium">
            Key Questions
          </div>
          {reading.questions.map((q, qi) => (
            <div key={qi} className="mb-4">
              <div className="flex gap-3 mb-2">
                <span className="text-[#B5532A] font-bold text-sm mt-0.5">◆</span>
                <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
                  {q}
                </p>
              </div>
              <div className="ml-6">
                <PaperField
                  storageKey={SK(`readings:q:${i}:${qi}`)}
                  placeholder="Your response…"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    <div className="mt-6">
      <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-3 font-semibold">
        Learning Materials Highlights
      </h3>
      <p className="text-stone-700 mb-3 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
        Record the most meaningful, memorable, or insightful quote(s) from this week's readings or video
        lectures — and why they struck you.
      </p>
      <PaperField
        storageKey={SK('highlights:quotes')}
        placeholder="Quotes that stayed with me…"
        rows={5}
      />
    </div>
  </section>
);

const EC6Section = () => (
  <section className="mb-16">
    <SectionHeader number="04" title="EC-6 Competency Connection" icon={FileText} />

    <div className="p-6 bg-[#2C2A26] text-[#FAF6EE] rounded-sm">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-4">
        Texas Educator Certification Examination · EC–6 (391) · Geology
      </p>

      <div className="mb-5">
        <h4 className="text-[#C89B3C] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
          Competency 004 — Concepts and Processes
        </h4>
        <p className="text-sm text-stone-300 italic mb-2">
          The teacher knows and understands the unifying concepts and processes that are common to all sciences.
        </p>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
          <span className="text-stone-400">A.</span> Understands how a unifying, explanatory framework
          across the science disciplines is provided by the concepts and processes of systems, order,
          and organization; evidence, models, and explanation; change, constancy, and measurements;
          and form and function.
        </p>
      </div>

      <div>
        <h4 className="text-[#C89B3C] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
          Competency 015 — Structure and Function of Earth Systems
        </h4>
        <p className="text-sm text-stone-300 italic mb-2">
          The teacher understands the structure and function of Earth systems.
        </p>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
          <span className="text-stone-400">A.</span> Understands the structure of Earth and analyzes
          constructive and destructive processes (including plate tectonics, weathering, and erosion)
          that produce geologic change, including how these processes have affected Earth history.
        </p>
      </div>
    </div>
  </section>
);


// ─────────────────────────────────────────────────────────────
// LAYERS OF TIME GAME (recreated from AMNH OLogy)
// ─────────────────────────────────────────────────────────────

const ALL_ORGANISMS = {
  homo_sapiens: { label: 'Homo sapiens', Icon: Skull },
  mammal: { label: 'Early mammal', Icon: Skull },
  beetle: { label: 'Beetle', Icon: Bug },
  protorosaur: { label: 'Protorosaur', Icon: Footprints },
  flowering_plant: { label: 'Flowering plant', Icon: Flower },
  fern: { label: 'Fern', Icon: Sprout },
  trilobite: { label: 'Trilobite', Icon: Shell },
  pterosaur: { label: 'Pterosaur', Icon: Bird },
  ginkgo: { label: 'Ginkgo', Icon: TreePine },
  ammonite: { label: 'Ammonite', Icon: Snail },
  shark: { label: 'Shark', Icon: Fish },
  fish: { label: 'Fish', Icon: Fish },
};

const LEVELS = {
  easy: {
    name: 'Easy',
    organisms: ['mammal', 'fern', 'fish', 'trilobite'],
    layers: [
      { id: 'E1', fossils: ['mammal', 'fern'] },
      { id: 'E2', fossils: ['fern', 'fish'] },
      { id: 'E3', fossils: ['fern', 'fish', 'trilobite'] },
      { id: 'E4', fossils: ['fish', 'trilobite'] },
      { id: 'E5', fossils: ['trilobite'] },
    ],
    anchors: { top: 'mammal', bottom: 'trilobite' },
    topAnchorLabel: 'Early mammals',
  },
  medium: {
    name: 'Medium',
    organisms: ['homo_sapiens', 'beetle', 'protorosaur', 'flowering_plant', 'trilobite', 'pterosaur', 'ginkgo'],
    layers: [
      { id: 'M1', fossils: ['homo_sapiens', 'beetle', 'flowering_plant', 'ginkgo'] },
      { id: 'M2', fossils: ['beetle', 'flowering_plant', 'ginkgo'] },
      { id: 'M3', fossils: ['beetle', 'flowering_plant', 'pterosaur', 'ginkgo'] },
      { id: 'M4', fossils: ['beetle', 'pterosaur', 'ginkgo'] },
      { id: 'M5', fossils: ['beetle', 'protorosaur', 'pterosaur', 'ginkgo'] },
      { id: 'M6', fossils: ['beetle', 'protorosaur', 'ginkgo'] },
      { id: 'M7', fossils: ['protorosaur', 'trilobite'] },
    ],
    anchors: { top: 'homo_sapiens', bottom: 'trilobite' },
    topAnchorLabel: 'Humans (Homo sapiens)',
  },
  hard: {
    name: 'Hard',
    organisms: ['homo_sapiens', 'beetle', 'flowering_plant', 'fern', 'ginkgo', 'shark', 'pterosaur', 'ammonite', 'trilobite'],
    layers: [
      { id: 'H1', fossils: ['homo_sapiens', 'beetle', 'flowering_plant', 'fern', 'ginkgo', 'shark'] },
      { id: 'H2', fossils: ['beetle', 'flowering_plant', 'fern', 'ginkgo', 'shark'] },
      { id: 'H3', fossils: ['beetle', 'flowering_plant', 'fern', 'ginkgo', 'shark', 'pterosaur', 'ammonite'] },
      { id: 'H4', fossils: ['beetle', 'fern', 'ginkgo', 'shark', 'pterosaur', 'ammonite'] },
      { id: 'H5', fossils: ['beetle', 'fern', 'shark', 'pterosaur', 'ammonite'] },
      { id: 'H6', fossils: ['beetle', 'fern', 'shark', 'ammonite', 'trilobite'] },
      { id: 'H7', fossils: ['fern', 'shark', 'ammonite', 'trilobite'] },
    ],
    anchors: { top: 'homo_sapiens', bottom: 'trilobite' },
    topAnchorLabel: 'Humans (Homo sapiens)',
  },
};

const scrambleLayers = (correctLayers) => {
  let shuffled;
  do {
    shuffled = [...correctLayers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffled.every((l, i) => l.id === correctLayers[i].id));
  return shuffled;
};

const LayersOfTimeGame = () => {
  const [levelKey, setLevelKey] = useState('medium');
  const level = LEVELS[levelKey];
  const [layers, setLayers] = useState(() => scrambleLayers(level.layers));
  const [checked, setChecked] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  // Re-scramble whenever level changes
  useEffect(() => {
    setLayers(scrambleLayers(LEVELS[levelKey].layers));
    setChecked(false);
  }, [levelKey]);

  // For each organism, find which current layer indices contain it
  const columnState = {};
  for (const org of level.organisms) {
    const indices = [];
    layers.forEach((l, i) => {
      if (l.fossils.includes(org)) indices.push(i);
    });
    const isContiguous = indices.length <= 1 ||
      (indices[indices.length - 1] - indices[0] === indices.length - 1);
    columnState[org] = { indices, isContiguous };
  }

  const topAnchorFirstIdx = layers.findIndex(l => l.fossils.includes(level.anchors.top));
  const bottomAnchorFirstIdx = layers.findIndex(l => l.fossils.includes(level.anchors.bottom));
  const directionCorrect = topAnchorFirstIdx < bottomAnchorFirstIdx;
  const allContiguous = Object.values(columnState).every(c => c.isContiguous);
  const allCorrect = allContiguous && directionCorrect;

  const reset = () => { setLayers(scrambleLayers(level.layers)); setChecked(false); };

  const moveLayer = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= layers.length) return;
    const newLayers = [...layers];
    [newLayers[idx], newLayers[newIdx]] = [newLayers[newIdx], newLayers[idx]];
    setLayers(newLayers);
    setChecked(false);
  };

  const handleDragStart = (idx) => (e) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (idx) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoverIdx(idx);
  };
  const handleDrop = (idx) => (e) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newLayers = [...layers];
    const [removed] = newLayers.splice(draggedIdx, 1);
    newLayers.splice(idx, 0, removed);
    setLayers(newLayers);
    setDraggedIdx(null);
    setHoverIdx(null);
    setChecked(false);
  };
  const handleDragEnd = () => { setDraggedIdx(null); setHoverIdx(null); };

  return (
    <div className="my-6 p-5 bg-white border border-stone-300 rounded-sm" style={{ boxShadow: '2px 3px 0 rgba(60, 40, 20, 0.06)' }}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="text-base text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
            Layers of Time — Interactive
          </h4>
          <p className="text-sm text-stone-600 italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
            Drag layers (or use ↑↓) to put them in chronological order. Each species' fossils should
            form a continuous vertical block.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setChecked(true)}
            className="px-3 py-1.5 text-xs uppercase rounded-sm flex items-center gap-1.5"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              backgroundColor: '#4A5D3F',
              color: '#FAF6EE',
              border: 'none',
            }}
          >
            <Check size={12} /> Check
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs uppercase rounded-sm flex items-center gap-1.5"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              backgroundColor: 'transparent',
              color: '#5C4B43',
              border: '1px solid #5C4B43',
            }}
          >
            <RefreshCw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="mb-5 flex items-center gap-1 p-1 rounded-sm w-fit" style={{ background: '#F5EFE0', border: '1px solid #E0D5C0' }}>
        {Object.entries(LEVELS).map(([key, lv]) => (
          <button
            key={key}
            onClick={() => setLevelKey(key)}
            className="px-3 py-1.5 text-xs uppercase transition-colors rounded-sm"
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              backgroundColor: levelKey === key ? '#2C2A26' : 'transparent',
              color: levelKey === key ? '#FAF6EE' : '#5C4B43',
              border: 'none',
            }}
          >
            {lv.name}
          </button>
        ))}
        <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 ml-3 mr-2" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
          {level.layers.length} layers · {level.organisms.length} species
        </span>
      </div>

      {/* Game board */}
      <div className="overflow-x-auto" style={{ overflowY: 'visible' }}>
        <div style={{ minWidth: levelKey === 'hard' ? '700px' : levelKey === 'easy' ? '420px' : '560px' }}>
          {/* Column headers — taller container to fit rotated labels */}
          <div className="flex" style={{ paddingLeft: '44px', overflow: 'visible' }}>
            {level.organisms.map(org => {
              const { label } = ALL_ORGANISMS[org];
              const state = columnState[org];
              const labelColor = checked
                ? (state.isContiguous ? '#4A5D3F' : '#B5532A')
                : '#5C4B43';
              return (
                <div key={org} className="flex-1 flex justify-center items-end pb-2" style={{ height: '110px', overflow: 'visible' }}>
                  <span
                    style={{
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: labelColor,
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'left bottom',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* PRESENT marker */}
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
              ↑ Present (most recent)
            </span>
          </div>

          {/* Layers */}
          {layers.map((layer, idx) => (
            <div
              key={layer.id}
              draggable
              onDragStart={handleDragStart(idx)}
              onDragOver={handleDragOver(idx)}
              onDrop={handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-stretch border rounded-sm mb-1 transition-all ${
                draggedIdx === idx ? 'opacity-40' : ''
              }`}
              style={{
                background: 'linear-gradient(180deg, #EBD9B0 0%, #DBC691 100%)',
                borderColor: hoverIdx === idx && draggedIdx !== idx ? '#4A5D3F' : '#A8916B',
                borderWidth: hoverIdx === idx && draggedIdx !== idx ? '2px' : '1px',
                minHeight: '56px',
                cursor: 'grab',
              }}
            >
              <div className="flex flex-col items-center justify-center px-2 border-r" style={{ background: '#C9AE7B', borderColor: '#A8916B' }}>
                <GripVertical size={14} className="text-stone-700 mb-1" />
                <div className="flex flex-col">
                  <button
                    onClick={() => moveLayer(idx, -1)}
                    disabled={idx === 0}
                    className="text-stone-700 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move up"
                  >
                    <ChevronUp size={11} />
                  </button>
                  <button
                    onClick={() => moveLayer(idx, 1)}
                    disabled={idx === layers.length - 1}
                    className="text-stone-700 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move down"
                  >
                    <ChevronDown size={11} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex">
                {level.organisms.map(org => {
                  const hasOrganism = layer.fossils.includes(org);
                  const { Icon } = ALL_ORGANISMS[org];
                  const state = columnState[org];
                  let wrapStyle = {};
                  if (checked && hasOrganism) {
                    wrapStyle = state.isContiguous
                      ? { background: 'rgba(74, 93, 63, 0.18)', border: '2px solid #4A5D3F', borderRadius: '50%' }
                      : { background: 'rgba(181, 83, 42, 0.15)', border: '2px solid #B5532A', borderRadius: '50%' };
                  }
                  return (
                    <div key={org} className="flex-1 flex items-center justify-center py-2">
                      {hasOrganism && (
                        <div className="p-1.5" style={wrapStyle}>
                          <Icon size={18} className="text-stone-800" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* PAST marker */}
          <div className="flex items-center gap-2 mt-1 ml-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
              ↓ Past (oldest)
            </span>
          </div>
        </div>
      </div>

      {/* Status message */}
      {checked && (
        <div
          className="mt-4 p-3 rounded-sm text-sm"
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '14.5px',
            lineHeight: '1.55',
            background: allCorrect ? 'rgba(74, 93, 63, 0.1)' : 'rgba(181, 83, 42, 0.08)',
            border: `1px solid ${allCorrect ? '#4A5D3F' : '#B5532A'}40`,
            color: allCorrect ? '#3D4D33' : '#8B3F20',
          }}
        >
          {allCorrect
            ? '✓ Solved. Each species\' fossils form a continuous vertical block — that\'s the principle of superposition in action.'
            : !directionCorrect && allContiguous
              ? `✓ Each column is continuous — but check the direction. ${level.topAnchorLabel} lived most recently, so that layer belongs near the top.`
              : 'Not quite. Look for fossils with orange outlines — those species appear in non-continuous layers, which can\'t be right. Move those layers to make each species\' fossils adjacent.'}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500 italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
        Adapted from the AMNH OLogy <button
          onClick={() => window.open('https://www.amnh.org/ology/features/layersoftime/', '_blank', 'noopener,noreferrer')}
          className="text-stone-600 underline underline-offset-2 hover:text-stone-800 bg-transparent border-none p-0 cursor-pointer italic"
          style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '12px' }}
        >Layers of Time</button> game.
      </div>
    </div>
  );
};

const StenoSection = () => (
  <section className="mb-16">
    <SectionHeader number="05" title="Steno's Principles" icon={Layers} />

    <div className="mb-6">
      <h3 className="text-base text-stone-900 mb-3" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
        Background
      </h3>
      <p className="text-stone-800 leading-relaxed mb-3" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
        Nicolas Steno was a pioneering geologist whose principles are foundational to the study of
        stratigraphy. The three main principles:
      </p>
      <ol className="space-y-2 ml-2 text-stone-800" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
        <li><span className="text-[#B5532A] font-semibold">1.</span> <span className="font-semibold">Superposition</span> — In undisturbed layers of rock, the oldest layers are at the bottom, the youngest at the top.</li>
        <li><span className="text-[#B5532A] font-semibold">2.</span> <span className="font-semibold">Original Horizontality</span> — Layers of rock are originally deposited horizontally.</li>
        <li><span className="text-[#B5532A] font-semibold">3.</span> <span className="font-semibold">Lateral Continuity</span> — Layers initially extend laterally in all directions.</li>
      </ol>
    </div>

    <LayersOfTimeGame />

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 mt-8 font-semibold">
      Before playing
    </h3>
    <MetacogPrompt storageKey={SK('steno:before:knowledge')}>
      What prior knowledge did you have about Steno's principles?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('steno:before:strategy')}>
      What strategies did you plan to use to arrange the rock layers?
    </MetacogPrompt>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 mt-8 font-semibold">
      During the game
    </h3>
    <MetacogPrompt storageKey={SK('steno:during:challenges')}>
      What challenges did you encounter while arranging the layers?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('steno:during:overcome')}>
      How did you overcome these challenges?
    </MetacogPrompt>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 mt-8 font-semibold">
      After playing — reflection entry
    </h3>
    <MetacogPrompt storageKey={SK('steno:after:helped')}>
      How did Steno's principles help you determine the order of the rock layers?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('steno:after:metacog')}>
      How did reflecting on your thought process enhance your understanding of stratigraphy?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('steno:after:gamification')}>
      How did the gamification and visualization aspects of this activity aid in your learning retention
      and understanding of the concepts?
    </MetacogPrompt>
  </section>
);

const MonitorSection = () => (
  <section className="mb-16">
    <SectionHeader number="06" title="Monitor Your Progress" icon={Compass} />
    <p className="mb-6 text-stone-700 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      A mid-module check-in. Pause and reflect honestly.
    </p>
    <MetacogPrompt storageKey={SK('monitor:strategies')}>
      Are you using the best strategies to learn this material? If not, what could you do differently?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('monitor:pace')}>
      Are you going too fast through the module? Too slowly? Think about which areas you moved through
      quickly vs. took more time on — how is your pace affecting your learning?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('monitor:understanding')}>
      Are you understanding the information (or mastering the skills) in this module? If not, what can
      you do?
    </MetacogPrompt>
  </section>
);

const QuizWrapperSection = () => (
  <section className="mb-16">
    <SectionHeader number="07" title="Quiz Wrapper" icon={FileText} />
    <p className="mb-6 text-stone-700 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      Complete after taking the Module 1 quiz.
    </p>
    <MetacogPrompt storageKey={SK('quiz:prep')}>
      How did you study for this quiz? What strategies did you use to prepare? Which strategies seemed
      most effective?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('quiz:not_worked')}>
      What study practices did not work well? What should you not do, or do differently, next time?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('quiz:well')}>
      On which aspects of this quiz did you perform well? Why do you think you performed well on these
      aspects?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK('quiz:patterns')}>
      Can you see patterns in your errors and/or specific subjects? How can you address them in future
      preparation?
    </MetacogPrompt>
  </section>
);

const WrapUpSection = () => {
  const [galleryPiece, saveGallery] = useStored(SK('gallery:m1'));
  return (
    <section className="mb-16">
      <SectionHeader number="08" title="Module Wrap-Up" icon={Check} />
      <MetacogPrompt storageKey={SK('wrap:how_well')}>
        How well did you do on this module?
      </MetacogPrompt>
      <MetacogPrompt storageKey={SK('wrap:strategies')}>
        Which strategies worked best for you for each activity/assignment in this module?
      </MetacogPrompt>
      <MetacogPrompt storageKey={SK('wrap:aha')}>
        What are your most significant learnings, or "Aha!" moments, from this module?
      </MetacogPrompt>
      <MetacogPrompt storageKey={SK('wrap:reveal')}>
        What do these significant learnings reveal to you or help you realize about the principles of
        superposition?
      </MetacogPrompt>

      <div className="mt-8 p-5 bg-[#4A5D3F] text-[#FAF6EE] rounded-sm">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C89B3C] mb-3 font-semibold">
          Core Gallery Archive
        </h4>
        <p className="mb-4 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
          Select the work piece that captures your most significant learning achievement in this module
          and document it for your Core Gallery.
        </p>
        <textarea
          value={galleryPiece}
          onChange={(e) => saveGallery(e.target.value)}
          placeholder="Describe or paste your selected work piece here…"
          rows={4}
          className="w-full px-4 py-3 bg-[#3D3631] text-[#FAF6EE] border border-stone-600 rounded-sm focus:outline-none focus:border-[#C89B3C] placeholder:text-stone-500"
          style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}
        />
      </div>
    </section>
  );
};

const CarryingForwardSection = () => {
  const [confused, saveConfused, confusedSaveState] = useStored(SK('lingering:confused'));
  const [deeper, saveDeeper, deeperSaveState] = useStored(SK('lingering:deeper'));

  const hasContent = (confused && confused.trim()) || (deeper && deeper.trim());

  const renderField = (value, save, saveState, placeholder) => (
    <div className="relative my-2">
      <textarea
        value={value}
        onChange={(e) => save(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-[#FDFBF4] border border-stone-300/60 rounded-sm focus:outline-none focus:border-[#8B4513] focus:bg-white transition-colors resize-y text-stone-800 leading-relaxed"
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: '15px',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(139, 69, 19, 0.06) 27px, rgba(139, 69, 19, 0.06) 28px)',
          lineHeight: '28px',
        }}
      />
      <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-stone-400 transition-opacity"
        style={{ opacity: saveState === 'idle' ? 0 : 1 }}>
        {saveState === 'saving' ? '…saving' : '✓ saved'}
      </div>
    </div>
  );

  return (
    <section className="mb-16">
      <SectionHeader number="09" title="Carrying Forward" icon={Compass} />

      <p className="mb-6 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
        Naming the gaps you noticed makes them easier to close. Your answers below will appear at the
        top of <span className="font-semibold">Module 2</span> so you can pick the thread back up — and
        track whether you actually followed through.
      </p>

      <div className="mb-5">
        <div className="flex gap-3 mb-2">
          <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>?</span>
          <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
            What concepts are you still confused about, or want to clarify before moving on?
          </p>
        </div>
        <div className="ml-6">
          {renderField(confused, saveConfused, confusedSaveState, "Topics, ideas, or details that didn't click yet…")}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex gap-3 mb-2">
          <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>?</span>
          <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
            What topic from this module do you want to go deeper on independently?
          </p>
        </div>
        <div className="ml-6">
          {renderField(deeper, saveDeeper, deeperSaveState, 'A direction worth your own exploration…')}
        </div>
      </div>

      {hasContent && (
        <div className="mt-8 p-5 rounded-sm" style={{ background: '#F5EFE0', border: '1px solid rgba(139, 69, 19, 0.25)' }}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#8B4513] mb-2 font-semibold">
            What happens next
          </div>
          <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
            When you open Module 2, these notes will appear at the top so you can mark them resolved
            or carry them forward. Anything you leave unresolved continues to follow you into Module 3
            and beyond — and shows up in your Running Record.
          </p>
        </div>
      )}
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// CROSS-MODULE LINGERING QUESTIONS TRACKING
// ─────────────────────────────────────────────────────────────

const SK2 = (k) => `geol1403:m2:${k}`;
const TOTAL_MODULES = 8;

async function readTracking() {
  try {
    const r = await window.storage.get('geol1403:lingering:tracking');
    if (!r?.value) return {};
    try { return JSON.parse(r.value); } catch { return {}; }
  } catch { return {}; }
}

async function writeTracking(tracking) {
  try { await window.storage.set('geol1403:lingering:tracking', JSON.stringify(tracking)); } catch {}
}

async function readQuestionText(moduleN, type) {
  try {
    const r = await window.storage.get(`geol1403:m${moduleN}:lingering:${type}`);
    return r?.value || '';
  } catch { return ''; }
}

async function getAllLingeringQuestions() {
  const tracking = await readTracking();
  const result = [];
  for (let m = 0; m <= TOTAL_MODULES; m++) {
    for (const type of ['confused', 'deeper']) {
      const text = await readQuestionText(m, type);
      if (!text || !text.trim()) continue;
      const key = `m${m}:${type}`;
      const t = tracking[key] || { status: 'open', responses: {} };
      result.push({
        key, originModule: m, type, text,
        status: t.status, responses: t.responses || {},
        resolvedInModule: t.resolvedInModule || null,
      });
    }
  }
  return result;
}

async function getOpenLingeringBefore(currentModule) {
  const all = await getAllLingeringQuestions();
  return all.filter(q => q.originModule < currentModule && q.status === 'open');
}

// ─────────────────────────────────────────────────────────────
// RETURNING FROM PREVIOUS MODULES
// ─────────────────────────────────────────────────────────────

const LingeringQuestionCard = ({ question, currentModule, onUpdate }) => {
  const [response, setResponse] = useState(question.responses[`m${currentModule}`] || '');
  const timerRef = useRef(null);

  const updateResponse = (newVal) => {
    setResponse(newVal);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onUpdate(question.key, newVal, false), 800);
  };

  const markResolved = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onUpdate(question.key, response, true);
  };

  return (
    <div className="p-4 bg-white rounded-sm" style={{ border: '1px solid rgba(139, 69, 19, 0.2)' }}>
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: question.type === 'confused' ? '#B5532A' : '#4A5D3F', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
          {question.type === 'confused' ? 'Still confused about' : 'Wanted to explore'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
          From Module {String(question.originModule).padStart(2, '0')}
        </span>
      </div>
      <p className="mb-4 italic pl-3" style={{
        fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px',
        color: '#2C2A26', lineHeight: '1.55',
        borderLeft: `3px solid ${question.type === 'confused' ? '#B5532A' : '#4A5D3F'}`
      }}>
        "{question.text}"
      </p>

      <p className="mb-2 text-stone-800" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px', fontWeight: 500 }}>
        How did that go? Where are you with it now?
      </p>
      <textarea
        value={response}
        onChange={(e) => updateResponse(e.target.value)}
        placeholder="What you've learned, or where you're still stuck…"
        rows={2}
        className="w-full px-4 py-2.5 bg-[#FDFBF4] border border-stone-300/60 rounded-sm focus:outline-none focus:border-[#8B4513] focus:bg-white transition-colors resize-y text-stone-800"
        style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px', lineHeight: '1.55' }}
      />

      <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
        <button
          onClick={markResolved}
          disabled={!response.trim()}
          className="px-3 py-1.5 text-[11px] uppercase rounded-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontWeight: 600, letterSpacing: '0.08em',
            backgroundColor: '#4A5D3F', color: '#FAF6EE', border: 'none',
          }}
        >
          <Check size={11} /> Mark resolved
        </button>
        <span className="text-[10px] text-stone-500 italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
          {!response.trim() ? 'Type a response to mark resolved' : 'Or leave open to carry forward'}
        </span>
      </div>
    </div>
  );
};

const ReturningFromPrevious = ({ currentModule }) => {
  const [openQuestions, setOpenQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const qs = await getOpenLingeringBefore(currentModule);
      if (!cancelled) { setOpenQuestions(qs); setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [currentModule, refresh]);

  const handleUpdate = async (key, response, resolved) => {
    const tracking = await readTracking();
    const existing = tracking[key] || { status: 'open', responses: {} };
    const responses = { ...existing.responses, [`m${currentModule}`]: response };
    tracking[key] = {
      status: resolved ? 'resolved' : 'open',
      resolvedInModule: resolved ? currentModule : null,
      responses,
    };
    await writeTracking(tracking);
    setRefresh(r => r + 1);
  };

  if (!loaded || openQuestions.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="p-6 rounded-sm" style={{ background: '#FAF6EE', border: '2px solid #8B4513' }}>
        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B4513] font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            Carrying Forward
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            {openQuestions.length} open {openQuestions.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <h2 className="mb-3 leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: '26px', color: '#2C2A26' }}>
          Welcome back — picking up where you left off.
        </h2>
        <p className="text-stone-700 leading-relaxed mb-5" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
          You flagged these questions in earlier modules. Update each one — mark it resolved if you've
          worked through it, or leave it open and it'll continue to follow you forward. Either way, it
          stays in your <span className="font-semibold">Running Record</span> as a study reference.
        </p>

        <div className="space-y-3">
          {openQuestions.map(q => (
            <LingeringQuestionCard
              key={q.key}
              question={q}
              currentModule={currentModule}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// MODULE 2 DATA
// ─────────────────────────────────────────────────────────────

const M2_KEY_TERMS = [
  { term: "Plate Tectonics", definition: "The unifying theory that Earth's lithosphere is divided into rigid plates that move and interact, driven by mantle convection." },
  { term: "Continental Drift", definition: "Wegener's hypothesis that continents have shifted positions over geologic time — the precursor to plate tectonic theory." },
  { term: "Pangaea", definition: "The supercontinent that comprised all of Earth's landmasses about 200 million years ago, before breaking apart." },
  { term: "Convection Currents", definition: "Cyclical movements of material in Earth's mantle driven by heat differences — the engine that moves tectonic plates." },
  { term: "Lithosphere", definition: "Earth's rigid outer shell — the crust and uppermost mantle — broken into tectonic plates." },
  { term: "Asthenosphere", definition: "The partially molten, ductile layer of the upper mantle beneath the lithosphere on which plates ride." },
  { term: "Seafloor Spreading", definition: "The formation of new oceanic crust at mid-ocean ridges as plates move apart." },
  { term: "Divergent Boundary", definition: "Where two plates move apart, allowing magma to rise and form new crust (e.g., the Mid-Atlantic Ridge)." },
  { term: "Convergent Boundary", definition: "Where two plates collide, leading to subduction or mountain-building (e.g., the Himalayas, the Andes)." },
  { term: "Transform Boundary", definition: "Where two plates slide horizontally past each other, often producing earthquakes (e.g., the San Andreas Fault)." },
  { term: "Subduction", definition: "The process where a denser oceanic plate descends beneath a lighter plate into the mantle." },
  { term: "Mid-Ocean Ridge", definition: "An underwater mountain range formed by seafloor spreading at divergent boundaries." },
];

const M2_READINGS = [
  {
    title: "Chapter 2: Plate Tectonics — A Scientific Revolution Unfolds",
    sections: "Continental drift, seafloor spreading, plate boundaries",
    pages: "pp. 36–69",
    ppt: "02_earth13_lecture_ppt",
    questions: [
      "How did the accumulation of evidence over time lead to the shift from the continental drift hypothesis to the more comprehensive plate tectonics theory?",
      "In what ways do the interactions at different types of plate boundaries contribute to the overall dynamics of Earth's surface and interior?",
    ],
  },
  {
    title: "Chapter 5: Volcanoes and Volcanic Hazards",
    sections: "Volcano types, eruption styles, monitoring",
    pages: "pp. 134–171",
    ppt: "05_EARTH13_LECTURE_PPT",
    questions: [
      "How do the different types of volcanoes and their eruption styles reflect the underlying geological processes and magma composition?",
      "In what ways does our understanding of volcanic processes and monitoring techniques contribute to hazard mitigation and public safety in volcanically active regions?",
    ],
  },
  {
    title: "Chapter 11: Earthquakes and Earthquake Hazards",
    sections: "Seismicity, distribution, prediction methods",
    pages: "pp. 310–339",
    ppt: "11_earth13_lecture_ppt",
    questions: [
      "How does the relationship between plate tectonics and earthquake distribution inform our understanding of seismic risk in different regions?",
      "In what ways do the limitations of current earthquake prediction methods impact disaster preparedness and risk management strategies?",
    ],
  },
  {
    title: "Chapter 12: Earth's Interior",
    sections: "Crust, mantle, outer and inner core; seismic evidence",
    pages: "pp. 340–361",
    ppt: "12_earth13_lecture_ppt",
    questions: [
      "What do seismic waves reveal about Earth's interior layers, and how have these findings shaped our model of Earth's structure?",
      "How do the physical and chemical properties of the core, mantle, and crust differ, and what does this tell us about Earth's formation?",
    ],
  },
];

const BOUNDARY_TYPES = [
  { value: 'divergent', label: 'Divergent' },
  { value: 'convergent_subduction', label: 'Convergent (Subduction)' },
  { value: 'convergent_collisional', label: 'Convergent (Collisional)' },
  { value: 'transform', label: 'Transform' },
];

const BOUNDARY_SCENARIOS = [
  {
    name: 'Mid-Atlantic Ridge',
    description: 'An underwater mountain range running down the center of the Atlantic Ocean, stretching over 16,000 km. Characterized by continuous volcanic activity where new oceanic crust forms as magma rises from below. The seafloor is actively spreading apart here.',
    answer: 'divergent',
  },
  {
    name: 'Pacific Rim (Ring of Fire)',
    description: 'A region encircling the Pacific Ocean with frequent earthquakes and numerous active volcanoes. Oceanic plates are forced down into the mantle beneath lighter continental plates, producing intense seismic activity and volcanic eruptions.',
    answer: 'convergent_subduction',
  },
  {
    name: 'The Himalayas',
    description: 'The world\'s highest mountain range, formed by the ongoing collision between the Indian Plate and the Eurasian Plate, beginning ~50 million years ago. The immense pressure has caused the crust to buckle and rise into towering mountains.',
    answer: 'convergent_collisional',
  },
  {
    name: 'Juan de Fuca & North American Plate',
    description: 'Located off the Pacific Northwest coast (Washington, Oregon, British Columbia). The denser oceanic Juan de Fuca plate is being forced beneath the lighter continental North American plate. Part of the Cascadia Subduction Zone.',
    answer: 'convergent_subduction',
  },
];

// ─────────────────────────────────────────────────────────────
// MODULE 2 SECTION COMPONENTS
// ─────────────────────────────────────────────────────────────

const Module2KeyTermsSection = () => {
  const [masteredList, setMasteredList] = useStored(SK2('terms:mastered'), []);
  const [order, setOrder] = useState(M2_KEY_TERMS.map((_, i) => i));
  const [shuffled, setShuffled] = useState(false);

  const masteredSet = new Set(masteredList);
  const toggleMastered = (term) => {
    setMasteredList(masteredSet.has(term) ? masteredList.filter(t => t !== term) : [...masteredList, term]);
  };
  const shuffle = () => { setOrder([...order].sort(() => Math.random() - 0.5)); setShuffled(true); };
  const reset = () => { setOrder(M2_KEY_TERMS.map((_, i) => i)); setShuffled(false); };
  const progress = masteredSet.size;

  return (
    <section className="mb-16">
      <SectionHeader number="01" title="Key Terms" icon={Layers} />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-stone-700 max-w-2xl leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
          Twelve terms that anchor this module on plate tectonics, Earth's interior, and the mechanisms
          that move continents.
        </p>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Known</div>
            <div className="text-2xl text-stone-900" style={{ fontFamily: "'Fraunces', serif" }}>
              {progress}<span className="text-stone-400 text-lg">/{M2_KEY_TERMS.length}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button onClick={shuffle} className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-stone-400 text-stone-700 hover:bg-stone-800 hover:text-[#FAF6EE] transition-colors flex items-center gap-1.5">
              <Shuffle size={11} /> shuffle
            </button>
            {shuffled && (
              <button onClick={reset} className="text-[11px] uppercase tracking-wider px-3 py-1.5 text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1.5">
                <RotateCcw size={11} /> reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#4A5D3F] transition-all duration-500" style={{ width: `${(progress / M2_KEY_TERMS.length) * 100}%` }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {order.map((idx) => (
          <Flashcard
            key={M2_KEY_TERMS[idx].term}
            index={idx}
            term={M2_KEY_TERMS[idx].term}
            definition={M2_KEY_TERMS[idx].definition}
            mastered={masteredSet.has(M2_KEY_TERMS[idx].term)}
            onToggleMastered={() => toggleMastered(M2_KEY_TERMS[idx].term)}
          />
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-stone-200">
        <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">
          Reflect on your vocabulary
        </h3>
        <MetacogPrompt storageKey={SK2('vocab:reflect:challenging')}>
          Were there any terms you found particularly challenging? Which ones, and why?
        </MetacogPrompt>
        <MetacogPrompt storageKey={SK2('vocab:reflect:overcome')}>
          How did you overcome these challenges?
        </MetacogPrompt>
      </div>
    </section>
  );
};

const Module2OverviewSection = () => (
  <section className="mb-16">
    <SectionHeader number="02" title="Module Overview & Goals" icon={Compass} />

    <div className="mb-8 p-5 bg-[#F5EFE0]/60 border-l-4 border-[#8B4513] rounded-r-sm">
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#8B4513] mb-3 font-semibold">Before you begin</h3>
      <ul className="space-y-1.5 text-stone-800" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
        <li>· Preview Module 2 in the course</li>
        <li>· Review the Module Overview page and Learning Activities list</li>
        <li>· Scan each page of the module</li>
        <li>· Complete the Metacognitive Moment below</li>
      </ul>
    </div>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">Metacognitive Moment</h3>

    <MetacogPrompt storageKey={SK2('overview:prior_knowledge')}>
      Based on the Module Overview, what do you already know about plate tectonics, volcanoes, and earthquakes?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('overview:time_needed')}>
      How much time will you need to complete this module?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('overview:motivation')}>
      How can you motivate yourself to engage with the activities to the best of your ability?
    </MetacogPrompt>

    <div className="mt-8">
      <PaperField storageKey={SK2('overview:goals')} label="My personal learning goals for this week" placeholder="What I want to achieve…" rows={4} />
    </div>
    <div className="mt-4">
      <PaperField storageKey={SK2('overview:learning_path')} label="My learning path for Module 2 (days/times scheduled)" placeholder="e.g. Mon: readings · Wed: lava lamp activity · Fri: boundaries practice…" rows={3} />
    </div>
  </section>
);

const Module2ReadingsSection = () => (
  <section className="mb-16">
    <SectionHeader number="03" title="Reading Notes & Key Questions" icon={BookOpen} />

    <p className="mb-8 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
      Four chapters in Module 2. Capture notes from each, and respond to the key questions in your own words.
    </p>

    {M2_READINGS.map((reading, i) => (
      <div key={i} className="mb-10 pb-8 border-b border-stone-200 last:border-0">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">Reading {i + 1} of {M2_READINGS.length}</div>
          <h3 className="text-lg text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>{reading.title}</h3>
          <p className="text-sm text-stone-600 italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
            {reading.sections} · {reading.pages}{reading.ppt && ` · ${reading.ppt}`}
          </p>
        </div>

        <PaperField storageKey={SK2(`readings:notes:${i}`)} label="Reading notes" placeholder="Notes from this reading…" rows={4} />

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2 font-medium">Key Questions</div>
          {reading.questions.map((q, qi) => (
            <div key={qi} className="mb-4">
              <div className="flex gap-3 mb-2">
                <span className="text-[#B5532A] font-bold text-sm mt-0.5">◆</span>
                <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>{q}</p>
              </div>
              <div className="ml-6">
                <PaperField storageKey={SK2(`readings:q:${i}:${qi}`)} placeholder="Your response…" rows={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    <div className="mt-6">
      <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-3 font-semibold">Learning Materials Highlights</h3>
      <p className="text-stone-700 mb-3 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
        Quotes, ideas, or moments from this week's readings or lectures that stuck with you.
      </p>
      <PaperField storageKey={SK2('highlights:quotes')} placeholder="Quotes that stayed with me…" rows={5} />
    </div>
  </section>
);

const Module2EC6Section = () => (
  <section className="mb-16">
    <SectionHeader number="04" title="EC-6 Competency Connection" icon={FileText} />
    <div className="p-6 bg-[#2C2A26] text-[#FAF6EE] rounded-sm">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-4">Texas Educator Certification Examination · EC–6 (391) · Geology</p>

      <div className="mb-5">
        <h4 className="text-[#C89B3C] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Competency 004 — Concepts and Processes</h4>
        <p className="text-sm text-stone-300 italic mb-2">Understands unifying concepts across the sciences: systems, evidence, models, change, form and function.</p>
      </div>

      <div className="mb-5">
        <h4 className="text-[#C89B3C] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Competency 007 — Forces and Motion</h4>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
          <span className="text-stone-400">D.</span> Analyzes the relationship between force and motion in geologic processes.
        </p>
      </div>

      <div>
        <h4 className="text-[#C89B3C] mb-2" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Competency 009 — Energy and Interactions</h4>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
          <span className="text-stone-400">B.</span> Understands heat-energy processes including melting, evaporation, conduction, convection, and radiation.
        </p>
      </div>
    </div>
  </section>
);

const LAVA_LAMP_GIF = "data:image/gif;base64,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";

const LavaLamp = () => (
  <img
    src={LAVA_LAMP_GIF}
    alt="Animated lava lamp showing wax rising and falling"
    style={{
      width: '160px',
      height: 'auto',
      borderRadius: '6px',
      boxShadow: '0 3px 10px rgba(60, 40, 20, 0.18)',
      display: 'block',
    }}
  />
);

const LavaLampActivity = () => (
  <section className="mb-16">
    <SectionHeader number="05" title="Lava Lamp & Mantle Convection" icon={Compass} />

    <div className="mb-6 p-5 bg-[#F5EFE0]/60 border-l-4 border-[#C89B3C] rounded-r-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <div className="flex-shrink-0 pt-2">
        <LavaLamp />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-stone-700 mb-2 font-semibold">Activity</h4>
        <p className="text-stone-800 leading-relaxed mb-3" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
          A lava lamp models the convection currents driving plate tectonics. Hot wax rises from a
          heat source at the bottom, cools and darkens at the top, then sinks back down — the same
          cyclic motion that moves Earth's mantle. Watch the lamp as a thinking tool, or find a
          longer ambient video to study.
        </p>
        <button
          onClick={() => window.open('https://www.youtube.com/results?search_query=orange+lava+lamp+relaxation', '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center gap-1.5 text-sm text-[#8B4513] hover:text-[#B5532A] underline underline-offset-2 cursor-pointer bg-transparent border-none p-0"
          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
        >
          Find a longer lava lamp video →
        </button>
      </div>
    </div>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">Observation</h3>
    <MetacogPrompt storageKey={SK2('lava:observe')}>
      Describe what you observe. How does the wax behave as it heats and cools — what's the pattern of rising and falling?
    </MetacogPrompt>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 mt-8 font-semibold">Connect to plate tectonics</h3>
    <MetacogPrompt storageKey={SK2('lava:convection')}>
      How does the movement of wax in the lava lamp simulate convection currents in Earth's mantle? What causes the wax to rise and fall, and how is that similar to mantle material?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('lava:plates')}>
      Explain how convection currents in the mantle drive the movement of tectonic plates. Use the lava lamp as a model in your explanation.
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('lava:boundaries')}>
      How might convection currents affect the different types of plate boundaries (divergent, convergent, transform)?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('lava:heat')}>
      How do convection, conduction, and radiation each contribute to heat transfer within Earth's interior?
    </MetacogPrompt>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 mt-8 font-semibold">Reflect on the model</h3>
    <MetacogPrompt storageKey={SK2('lava:helpful')}>
      What aspects of the lava lamp model were most helpful for understanding mantle convection?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('lava:misleading')}>
      What aspects of the lava lamp model might be misleading or overly simplistic?
    </MetacogPrompt>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 mt-8 font-semibold">Micro-extension</h3>
    <p className="text-stone-700 mb-2 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
      Research a specific plate boundary (e.g., San Andreas Fault, Mid-Atlantic Ridge, Himalayas) and summarize how mantle convection influences geological activity there.
    </p>
    <PaperField storageKey={SK2('lava:extension')} placeholder="4–6 sentences on a specific plate boundary…" rows={5} />
  </section>
);

const ContinentalDriftActivity = () => {
  const rows = ['Evidence 1', 'Evidence 2', 'Mechanism', 'Scientific Acceptance'];
  return (
    <section className="mb-16">
      <SectionHeader number="06" title="Continental Drift vs. Plate Tectonics" icon={Layers} />

      <div className="mb-6 p-5 bg-[#F5EFE0]/40 border border-stone-300/50 rounded-sm">
        <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
          <span className="font-semibold">Compare</span> the pre-1960s understanding (Wegener's continental drift hypothesis)
          with the post-1960s theory of plate tectonics. Fill in each cell.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: '600px' }}>
          <div className="grid grid-cols-12 gap-2 mb-2 px-3 pb-2 border-b-2 border-stone-700">
            <div className="col-span-3 text-[10px] uppercase tracking-[0.2em] text-stone-600 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Aspect</div>
            <div className="col-span-4 text-[10px] uppercase tracking-[0.2em] text-[#B5532A] font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Pre-1960s · Continental Drift</div>
            <div className="col-span-5 text-[10px] uppercase tracking-[0.2em] text-[#4A5D3F] font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Post-1960s · Plate Tectonics</div>
          </div>
          {rows.map(row => (
            <div key={row} className="grid grid-cols-12 gap-2 mb-2 px-3 py-3 bg-[#FDFBF4] border border-stone-200 rounded-sm">
              <div className="col-span-3 flex items-start">
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 500, color: '#2C2A26' }}>{row}</span>
              </div>
              <div className="col-span-4">
                <PaperField storageKey={SK2(`comp:${row}:pre`)} placeholder="…" rows={3} />
              </div>
              <div className="col-span-5">
                <PaperField storageKey={SK2(`comp:${row}:post`)} placeholder="…" rows={3} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">Reflect and respond</h3>
        <MetacogPrompt storageKey={SK2('comp:reflect:diff')}>
          How did you differentiate between the evidence supporting Wegener's hypothesis and the evidence supporting plate tectonics? What resources or thinking did you use?
        </MetacogPrompt>
        <MetacogPrompt storageKey={SK2('comp:reflect:mech')}>
          What challenges did you face in understanding the mechanisms proposed by Wegener versus those accepted in plate tectonics? How did you work through them?
        </MetacogPrompt>
        <MetacogPrompt storageKey={SK2('comp:reflect:accept')}>
          How did learning about the scientific community's acceptance of these theories shape your understanding of how scientific knowledge develops over time?
        </MetacogPrompt>
      </div>
    </section>
  );
};

const IdentifyBoundariesActivity = () => {
  const [answers, setAnswers] = useStored(SK2('boundary:answers'), {});
  const [checked, setChecked] = useStored(SK2('boundary:checked'), false);

  const updateAnswer = (i, value) => setAnswers({ ...answers, [i]: value });
  const correct = BOUNDARY_SCENARIOS.filter((s, i) => answers[i] === s.answer).length;
  const attempted = Object.values(answers).filter(v => v).length;

  return (
    <section className="mb-16">
      <SectionHeader number="07" title="Identifying Plate Boundaries" icon={Compass} />

      <div className="mb-6 p-5 bg-[#F5EFE0]/40 border border-stone-300/50 rounded-sm">
        <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
          Four real-world locations. Read each description, identify the boundary type, and explain your reasoning.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {BOUNDARY_SCENARIOS.map((scenario, i) => {
          const userAnswer = answers[i] || '';
          const isCorrect = checked && userAnswer === scenario.answer;
          const isWrong = checked && userAnswer !== '' && userAnswer !== scenario.answer;
          return (
            <div key={i} className="p-4 bg-[#FDFBF4] border border-stone-300/60 rounded-sm">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="text-stone-900" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: '17px' }}>{scenario.name}</h4>
              </div>
              <p className="mb-4 text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
                {scenario.description}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mr-2" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Boundary type:</label>
                <select
                  value={userAnswer}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                  className={`w-full sm:w-72 px-3 py-2 bg-white border rounded-sm text-sm focus:outline-none transition-colors ${
                    isCorrect ? 'border-[#4A5D3F] bg-[#4A5D3F]/5' :
                    isWrong ? 'border-[#B5532A] bg-[#B5532A]/5' :
                    'border-stone-300 focus:border-stone-600'
                  }`}
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  <option value="">— select —</option>
                  {BOUNDARY_TYPES.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
                {isCorrect && <Check size={16} className="text-[#4A5D3F]" />}
                {isWrong && <span className="text-[#B5532A] text-sm font-semibold">✗</span>}
              </div>
              <PaperField storageKey={SK2(`boundary:reasoning:${i}`)} label="Your reasoning (3–4 sentences)" placeholder="Why this boundary type?" rows={3} />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-10">
        <button
          onClick={() => setChecked(!checked)}
          className="px-4 py-2 text-sm uppercase rounded-sm"
          style={{
            fontFamily: "ui-sans-serif, system-ui, sans-serif", fontWeight: 600, letterSpacing: '0.08em',
            backgroundColor: '#1F1A17', color: '#FAF6EE', border: 'none',
          }}
        >
          {checked ? 'Hide check' : 'Check answers'}
        </button>
        {checked && (
          <div className="text-sm text-stone-700" style={{ fontFamily: "'Fraunces', serif" }}>
            <span className="text-2xl text-stone-900">{correct}</span>
            <span className="text-stone-500"> / {BOUNDARY_SCENARIOS.length} correct</span>
            {attempted < BOUNDARY_SCENARIOS.length && (
              <span className="text-stone-500 italic ml-2">({BOUNDARY_SCENARIOS.length - attempted} unanswered)</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">Reflect</h3>
        <MetacogPrompt storageKey={SK2('boundary:reflect:hardest')}>
          Which scenario was hardest to classify, and why?
        </MetacogPrompt>
        <MetacogPrompt storageKey={SK2('boundary:reflect:strategy')}>
          What strategy did you use to match descriptions to boundary types? Did it work consistently?
        </MetacogPrompt>
      </div>
    </section>
  );
};

const Module2MonitorSection = () => (
  <section className="mb-16">
    <SectionHeader number="08" title="Monitor Your Progress" icon={Compass} />
    <p className="mb-6 text-stone-700 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      A mid-module check-in. Pause and reflect honestly.
    </p>
    <MetacogPrompt storageKey={SK2('monitor:strategies')}>
      Are you using the best strategies to learn this material? If not, what could you do differently?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('monitor:pace')}>
      Are you going too fast through the module? Too slowly? How is your pace affecting your learning?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK2('monitor:understanding')}>
      Are you understanding the information (or mastering the skills) in this module? If not, what can you do?
    </MetacogPrompt>
  </section>
);

const Module2QuizWrapperSection = () => (
  <section className="mb-16">
    <SectionHeader number="09" title="Quiz Wrapper" icon={FileText} />
    <p className="mb-6 text-stone-700 italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      Complete after taking the Module 2 quiz.
    </p>
    <MetacogPrompt storageKey={SK2('quiz:prep')}>How did you study? Which strategies were most effective?</MetacogPrompt>
    <MetacogPrompt storageKey={SK2('quiz:not_worked')}>What didn't work well? What will you do differently next time?</MetacogPrompt>
    <MetacogPrompt storageKey={SK2('quiz:well')}>Where did you perform well? Why?</MetacogPrompt>
    <MetacogPrompt storageKey={SK2('quiz:patterns')}>Do you see patterns in your errors? How will you address them?</MetacogPrompt>
  </section>
);

const Module2WrapUpSection = () => {
  const [galleryPiece, saveGallery] = useStored(SK2('gallery:m2'));
  return (
    <section className="mb-16">
      <SectionHeader number="10" title="Module Wrap-Up" icon={Check} />
      <MetacogPrompt storageKey={SK2('wrap:how_well')}>How well did you do on this module?</MetacogPrompt>
      <MetacogPrompt storageKey={SK2('wrap:strategies')}>Which strategies worked best for each activity?</MetacogPrompt>
      <MetacogPrompt storageKey={SK2('wrap:aha')}>What are your most significant learnings or "Aha!" moments?</MetacogPrompt>
      <MetacogPrompt storageKey={SK2('wrap:synthesize')}>
        What do these significant learnings reveal about plate tectonics and Earth's dynamic systems?
      </MetacogPrompt>

      <div className="mt-8 p-5 bg-[#4A5D3F] text-[#FAF6EE] rounded-sm">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#C89B3C] mb-3 font-semibold">Core Gallery Archive</h4>
        <p className="mb-4 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
          Select the work piece that captures your most significant learning achievement in Module 2.
        </p>
        <textarea
          value={galleryPiece}
          onChange={(e) => saveGallery(e.target.value)}
          placeholder="Describe or paste your selected work piece here…"
          rows={4}
          className="w-full px-4 py-3 bg-[#3D3631] text-[#FAF6EE] border border-stone-600 rounded-sm focus:outline-none focus:border-[#C89B3C] placeholder:text-stone-500"
          style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}
        />
      </div>
    </section>
  );
};

const Module2CarryingForwardSection = () => {
  const [confused, saveConfused, confusedSaveState] = useStored(SK2('lingering:confused'));
  const [deeper, saveDeeper, deeperSaveState] = useStored(SK2('lingering:deeper'));
  const hasContent = (confused && confused.trim()) || (deeper && deeper.trim());

  const renderField = (value, save, saveState, placeholder) => (
    <div className="relative my-2">
      <textarea
        value={value} onChange={(e) => save(e.target.value)}
        placeholder={placeholder} rows={3}
        className="w-full px-4 py-3 bg-[#FDFBF4] border border-stone-300/60 rounded-sm focus:outline-none focus:border-[#8B4513] focus:bg-white transition-colors resize-y text-stone-800"
        style={{
          fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(139, 69, 19, 0.06) 27px, rgba(139, 69, 19, 0.06) 28px)',
          lineHeight: '28px',
        }}
      />
      <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-stone-400" style={{ opacity: saveState === 'idle' ? 0 : 1 }}>
        {saveState === 'saving' ? '…saving' : '✓ saved'}
      </div>
    </div>
  );

  return (
    <section className="mb-16">
      <SectionHeader number="11" title="Carrying Forward" icon={Compass} />
      <p className="mb-6 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
        Same drill as Module 1 — flag what's still open. These notes appear at the top of Module 3 and
        in your Running Record until you mark them resolved.
      </p>

      <div className="mb-5">
        <div className="flex gap-3 mb-2">
          <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>?</span>
          <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
            What concepts are you still confused about, or want to clarify before moving on?
          </p>
        </div>
        <div className="ml-6">{renderField(confused, saveConfused, confusedSaveState, "Topics that didn't click yet…")}</div>
      </div>

      <div className="mb-5">
        <div className="flex gap-3 mb-2">
          <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>?</span>
          <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
            What topic from this module do you want to go deeper on independently?
          </p>
        </div>
        <div className="ml-6">{renderField(deeper, saveDeeper, deeperSaveState, 'A direction worth your own exploration…')}</div>
      </div>

      {hasContent && (
        <div className="mt-8 p-5 rounded-sm" style={{ background: '#F5EFE0', border: '1px solid rgba(139, 69, 19, 0.25)' }}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#8B4513] mb-2 font-semibold">What happens next</div>
          <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
            These notes (plus anything still open from Module 1) will appear at the top of Module 3 so
            you can revisit each one. Everything stays in your Running Record either way.
          </p>
        </div>
      )}
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// RUNNING RECORD
// ─────────────────────────────────────────────────────────────

const RunningRecord = () => {
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const qs = await getAllLingeringQuestions();
      if (!cancelled) { setQuestions(qs); setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!loaded) {
    return <section className="mb-16"><p className="text-stone-500 italic">Loading…</p></section>;
  }

  if (questions.length === 0) {
    return (
      <section className="mb-16">
        <SectionHeader number="—" title="Running Record" icon={BookOpen} />
        <div className="p-8 bg-[#FDFBF4] border border-stone-300/60 rounded-sm text-center">
          <p className="text-stone-600 italic max-w-md mx-auto" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px', lineHeight: '1.6' }}>
            No flagged questions yet. As you complete modules and note things you want to revisit,
            they'll show up here as a running study guide — open and resolved alike.
          </p>
        </div>
      </section>
    );
  }

  const byModule = {};
  for (const q of questions) {
    if (!byModule[q.originModule]) byModule[q.originModule] = [];
    byModule[q.originModule].push(q);
  }
  const openCount = questions.filter(q => q.status === 'open').length;
  const resolvedCount = questions.filter(q => q.status === 'resolved').length;

  return (
    <section className="mb-16">
      <SectionHeader number="—" title="Running Record" icon={BookOpen} />

      <p className="mb-6 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
        A complete log of every question, concept, or topic you've flagged across all modules. Open
        items appear at the top of each new module until you mark them resolved. Resolved items stay
        here as a record of your learning.
      </p>

      <div className="mb-8 flex gap-6 flex-wrap">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl" style={{ fontFamily: "'Fraunces', serif", color: '#B5532A' }}>{openCount}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-600 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Open</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl" style={{ fontFamily: "'Fraunces', serif", color: '#4A5D3F' }}>{resolvedCount}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-600 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Resolved</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl text-stone-700" style={{ fontFamily: "'Fraunces', serif" }}>{questions.length}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-600 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>Total</span>
        </div>
      </div>

      {Object.entries(byModule).sort(([a], [b]) => Number(a) - Number(b)).map(([mod, qs]) => (
        <div key={mod} className="mb-8">
          <h3 className="mb-3 pb-2 border-b border-stone-300" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: '18px', color: '#2C2A26' }}>
            Module {String(mod).padStart(2, '0')}
          </h3>
          <div className="space-y-3">
            {qs.map(q => {
              const isResolved = q.status === 'resolved';
              return (
                <div key={q.key} className="p-4 rounded-sm" style={{
                  background: isResolved ? 'rgba(74, 93, 63, 0.06)' : '#FDFBF4',
                  border: `1px solid ${isResolved ? 'rgba(74, 93, 63, 0.3)' : 'rgba(139, 69, 19, 0.2)'}`,
                  opacity: isResolved ? 0.85 : 1,
                }}>
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{
                      color: q.type === 'confused' ? '#B5532A' : '#4A5D3F',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
                    }}>
                      {q.type === 'confused' ? 'Confused about' : 'Wanted to explore'}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 rounded-sm" style={{
                      backgroundColor: isResolved ? '#4A5D3F' : '#B5532A',
                      color: '#FAF6EE',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    }}>
                      {isResolved ? `✓ Resolved · M${q.resolvedInModule || '?'}` : 'Open'}
                    </span>
                  </div>
                  <p className="mb-3" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px', color: '#2C2A26', lineHeight: '1.6' }}>
                    {q.text}
                  </p>
                  {Object.keys(q.responses).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-200">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2 font-semibold" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                        Follow-ups
                      </div>
                      {Object.entries(q.responses).sort(([a], [b]) => a.localeCompare(b)).map(([mod, response]) => (
                        <div key={mod} className="mb-2 pl-3" style={{ borderLeft: '2px solid rgba(139, 69, 19, 0.3)' }}>
                          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mr-2" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                            {mod.toUpperCase()}:
                          </span>
                          <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14px', color: '#2C2A26' }}>
                            {response}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// MODULE 0 — GETTING STARTED
// ─────────────────────────────────────────────────────────────

const SK0 = (k) => `geol1403:m0:${k}`;

const Module0Welcome = () => (
  <section className="mb-16">
    <SectionHeader number="01" title="Welcome to GEOL 1403" icon={BookOpen} />

    <p className="text-stone-800 leading-relaxed mb-5 max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '16px' }}>
      This is your active learning notebook for <span className="font-semibold">Physical Geology</span> at Dallas College.
      Unlike a notebook where you'd transcribe lectures or copy out readings, this one is built around
      <span className="italic"> active engagement</span> — writing in your own words, noticing what's confusing, and
      tracking your own thinking across the whole semester.
    </p>

    <div className="p-5 bg-[#F5EFE0]/60 border-l-4 border-[#8B4513] rounded-r-sm">
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#8B4513] mb-3 font-semibold">
        Why "Activate Your Core"?
      </h3>
      <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
        The "Activate Your Core" framework asks you to be an active partner in your learning rather than
        a passive recipient. Every section in every module is designed to make you <span className="italic">think,
        choose, decide, or react</span> — not just absorb. The work you do here is the work that actually
        builds understanding.
      </p>
    </div>
  </section>
);

const Module0Metacognition = () => (
  <section className="mb-16">
    <SectionHeader number="02" title="What Is Metacognition?" icon={Compass} />

    <p className="text-stone-800 leading-relaxed mb-4 max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
      Metacognition is <span className="italic">thinking about your own thinking</span>. In learning, it's the difference between
      reading something and assuming you understood it, versus reading something, pausing to ask
      <span className="italic"> "did that actually land?"</span> — and noticing where it didn't.
    </p>

    <p className="text-stone-800 leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
      Research consistently shows that students who develop metacognitive habits outperform peers who don't,
      even when their starting abilities are similar. This isn't about being smart. It's about being aware.
    </p>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">The metacognitive loop</h3>
    <ol className="space-y-3 mb-8 ml-2 text-stone-800" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      <li><span className="text-[#B5532A] font-semibold">1. Plan</span> — What am I trying to learn? What's the best strategy?</li>
      <li><span className="text-[#B5532A] font-semibold">2. Monitor</span> — Is this working? Am I getting it? Where am I stuck?</li>
      <li><span className="text-[#B5532A] font-semibold">3. Evaluate</span> — What worked? What didn't? What's next?</li>
    </ol>

    <p className="text-stone-700 italic mb-6" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
      You'll see these three beats repeated throughout every module — in the Overview, Monitor, Wrap-Up, and Carrying Forward sections.
    </p>

    <h3 className="text-sm uppercase tracking-[0.2em] text-stone-600 mb-4 font-semibold">Reflect on your own thinking</h3>
    <MetacogPrompt storageKey={SK0('meta:past_learning')}>
      Think about a time you genuinely learned something difficult — inside or outside school. What did you do that worked?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK0('meta:stuck_reaction')}>
      What's your default reaction when you encounter material you don't understand?
    </MetacogPrompt>
  </section>
);

const Module0SelfAssessment = () => (
  <section className="mb-16">
    <SectionHeader number="03" title="Pre-Course Self-Assessment" icon={FileText} />

    <p className="text-stone-700 leading-relaxed mb-6 max-w-2xl italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      Baseline questions to answer once, now. At the end of the semester you'll be able to come back
      and see how your answers — and you — have changed.
    </p>

    <MetacogPrompt storageKey={SK0('assess:why_taking')}>
      Why are you taking GEOL 1403? (Required? Curious? Prerequisite? Be honest — there are no wrong answers.)
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK0('assess:prior_knowledge')}>
      What do you already know about geology? Where did you learn it — school, hobbies, family, the news, somewhere else?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK0('assess:science_history')}>
      What has your relationship with science been like up to now — in classes, in life, in your own curiosity?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK0('assess:strategies')}>
      What study strategies have worked for you in past classes? Which haven't?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK0('assess:concerns_hopes')}>
      What concerns or hopes do you have going into this course?
    </MetacogPrompt>
    <MetacogPrompt storageKey={SK0('assess:target')}>
      What's your target outcome for this course — a specific grade, real understanding, both, something else?
    </MetacogPrompt>
  </section>
);

const Module0HowItWorks = () => (
  <section className="mb-16">
    <SectionHeader number="04" title="How This Notebook Works" icon={Layers} />

    <p className="text-stone-800 leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
      Here's the logic behind the structure, so the repetition you'll see doesn't feel arbitrary.
    </p>

    <div className="space-y-5 mb-6">
      <div className="pl-5 border-l-2 border-[#8B4513]">
        <h4 className="text-base text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Auto-save</h4>
        <p className="text-stone-700 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
          Every text field saves as you type. You'll see a small "saved" indicator at the bottom right of each box.
          Close the tab and come back later — your work will be there.
        </p>
      </div>

      <div className="pl-5 border-l-2 border-[#8B4513]">
        <h4 className="text-base text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Consistent module structure</h4>
        <p className="text-stone-700 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
          Every module follows the same arc: Key Terms → Module Overview → Readings → Activities → Monitor → Quiz Wrapper → Wrap-Up → Carrying Forward.
          The repetition is intentional — it lets you focus on the geology, not on figuring out where you are.
        </p>
      </div>

      <div className="pl-5 border-l-2 border-[#B5532A]">
        <h4 className="text-base text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Carrying Forward</h4>
        <p className="text-stone-700 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
          At the end of every module you'll flag what's still confusing and what you want to go deeper on.
          Those questions appear at the top of the next module — you respond, and mark each one resolved
          or keep it open. Anything unresolved keeps following you forward until you close it out.
        </p>
      </div>

      <div className="pl-5 border-l-2 border-[#4A5D3F]">
        <h4 className="text-base text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Running Record</h4>
        <p className="text-stone-700 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
          A separate tab (the last one in the nav) shows every question you've flagged across the entire course,
          open and resolved alike — a complete study trail you can revisit anytime.
        </p>
      </div>

      <div className="pl-5 border-l-2 border-[#C89B3C]">
        <h4 className="text-base text-stone-900 mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>Export</h4>
        <p className="text-stone-700 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
          The "Export Notebook" button (top right) downloads your full notebook as a Markdown file you can
          open in Notion, Google Docs, or any text editor. Useful for studying for exams or referring back later.
        </p>
      </div>
    </div>
  </section>
);

const Module0Foundation = () => (
  <section className="mb-16">
    <SectionHeader number="05" title="Set Your Foundation" icon={Compass} />

    <p className="text-stone-700 leading-relaxed mb-6 max-w-2xl italic" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px' }}>
      Course-level commitments. Each module will ask you to plan that module specifically;
      this is the bigger frame those weekly plans live inside.
    </p>

    <PaperField
      storageKey={SK0('found:course_goal')}
      label="My overall goal for this course"
      placeholder="What does success look like by the end of the semester?"
      rows={3}
    />
    <PaperField
      storageKey={SK0('found:weekly_schedule')}
      label="My weekly study schedule (recurring blocks, not one-offs)"
      placeholder="e.g. Mon & Wed 7–8:30pm: readings · Sat morning: catch-up + practice…"
      rows={3}
    />
    <PaperField
      storageKey={SK0('found:environment')}
      label="My study environment — where, when, with what"
      placeholder="Where do you focus best? What time of day? Phone away? Coffee shop or library?"
      rows={3}
    />
    <PaperField
      storageKey={SK0('found:support')}
      label="My support system"
      placeholder="Study partner, instructor office hours, tutoring center, family member who'll ask how it's going…"
      rows={3}
    />
    <PaperField
      storageKey={SK0('found:non_negotiable')}
      label="My one non-negotiable"
      placeholder="The one thing I commit to not letting slip, no matter what."
      rows={2}
    />
  </section>
);

const Module0CarryingForward = () => {
  const [confused, saveConfused, confusedSaveState] = useStored(SK0('lingering:confused'));
  const [deeper, saveDeeper, deeperSaveState] = useStored(SK0('lingering:deeper'));
  const hasContent = (confused && confused.trim()) || (deeper && deeper.trim());

  const renderField = (value, save, saveState, placeholder) => (
    <div className="relative my-2">
      <textarea
        value={value} onChange={(e) => save(e.target.value)}
        placeholder={placeholder} rows={3}
        className="w-full px-4 py-3 bg-[#FDFBF4] border border-stone-300/60 rounded-sm focus:outline-none focus:border-[#8B4513] focus:bg-white transition-colors resize-y text-stone-800"
        style={{
          fontFamily: "'Newsreader', Georgia, serif", fontSize: '15px',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(139, 69, 19, 0.06) 27px, rgba(139, 69, 19, 0.06) 28px)',
          lineHeight: '28px',
        }}
      />
      <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wider text-stone-400" style={{ opacity: saveState === 'idle' ? 0 : 1 }}>
        {saveState === 'saving' ? '…saving' : '✓ saved'}
      </div>
    </div>
  );

  return (
    <section className="mb-16">
      <SectionHeader number="06" title="Carrying Forward" icon={Compass} />
      <p className="mb-6 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
        Course-level lingering questions — things you're going in already wondering about, or topics you
        hope to understand by the end. These appear at the top of Module 1 (and beyond, until you mark them resolved).
      </p>

      <div className="mb-5">
        <div className="flex gap-3 mb-2">
          <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>?</span>
          <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
            What about geology already confuses you, or worries you about taking this course?
          </p>
        </div>
        <div className="ml-6">{renderField(confused, saveConfused, confusedSaveState, "Concepts, topics, or worries to keep an eye on…")}</div>
      </div>

      <div className="mb-5">
        <div className="flex gap-3 mb-2">
          <span className="text-[#B5532A] font-bold mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>?</span>
          <p className="text-stone-800 leading-relaxed flex-1" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '15.5px' }}>
            What about geology are you genuinely curious about? What do you hope to understand by the end of the semester?
          </p>
        </div>
        <div className="ml-6">{renderField(deeper, saveDeeper, deeperSaveState, 'A direction worth following…')}</div>
      </div>

      {hasContent && (
        <div className="mt-8 p-5 rounded-sm" style={{ background: '#F5EFE0', border: '1px solid rgba(139, 69, 19, 0.25)' }}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#8B4513] mb-2 font-semibold">
            What happens next
          </div>
          <p className="text-stone-800 leading-relaxed" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '14.5px' }}>
            These notes will appear at the top of Module 1 — and continue to follow you forward into Module 2, 3, and beyond
            until you mark them resolved. Either way, they live permanently in your Running Record as a study reference.
          </p>
        </div>
      )}
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// MODULE VIEWS & NAVIGATION
// ─────────────────────────────────────────────────────────────

const MODULE_META = {
  m0: { number: 0, title: 'Getting Started', label: 'Module 00' },
  m1: { number: 1, title: 'The Nature of Geology', label: 'Module 01' },
  m2: { number: 2, title: 'Earth\'s Structure & Function', label: 'Module 02' },
  log: { number: null, title: 'Running Record', label: 'Record' },
};

const Module0View = () => (
  <>
    <Module0Welcome />
    <Module0Metacognition />
    <Module0SelfAssessment />
    <Module0HowItWorks />
    <Module0Foundation />
    <Module0CarryingForward />
  </>
);

const Module1View = () => (
  <>
    <ReturningFromPrevious currentModule={1} />
    <KeyTermsSection />
    <OverviewSection />
    <ReadingsSection />
    <EC6Section />
    <StenoSection />
    <MonitorSection />
    <QuizWrapperSection />
    <WrapUpSection />
    <CarryingForwardSection />
  </>
);

const Module2View = () => (
  <>
    <ReturningFromPrevious currentModule={2} />
    <Module2KeyTermsSection />
    <Module2OverviewSection />
    <Module2ReadingsSection />
    <Module2EC6Section />
    <LavaLampActivity />
    <ContinentalDriftActivity />
    <IdentifyBoundariesActivity />
    <Module2MonitorSection />
    <Module2QuizWrapperSection />
    <Module2WrapUpSection />
    <Module2CarryingForwardSection />
  </>
);

const ModuleNav = ({ active, onChange }) => {
  const items = [
    { key: 'm0', label: 'Module 00', sub: 'Getting Started', locked: false },
    { key: 'm1', label: 'Module 01', sub: 'Nature of Geology', locked: false },
    { key: 'm2', label: 'Module 02', sub: 'Earth\'s Structure', locked: false },
    { key: 'm3', label: 'Module 03', sub: 'Coming soon', locked: true },
    { key: 'm4', label: 'Module 04', sub: 'Coming soon', locked: true },
    { key: 'm5', label: 'Module 05', sub: 'Coming soon', locked: true },
    { key: 'm6', label: 'Module 06', sub: 'Coming soon', locked: true },
    { key: 'm7', label: 'Module 07', sub: 'Coming soon', locked: true },
    { key: 'm8', label: 'Module 08', sub: 'Coming soon', locked: true },
    { key: 'log', label: 'Running Record', sub: 'Your study trail', locked: false },
  ];
  return (
    <div className="border-t border-stone-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto">
          {items.map(item => {
            const isActive = active === item.key;
            if (item.locked) {
              return (
                <button
                  key={item.key}
                  disabled
                  className="px-4 py-3 whitespace-nowrap flex-shrink-0"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'not-allowed',
                    opacity: 0.45,
                  }}
                  aria-label={`${item.label} (locked)`}
                >
                  <div className="flex items-center gap-1.5 h-full">
                    <Lock size={11} style={{ color: '#8B8378' }} strokeWidth={2} />
                    <span style={{
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: '#8B8378',
                    }}>{item.label}</span>
                  </div>
                </button>
              );
            }
            return (
              <button
                key={item.key}
                onClick={() => onChange(item.key)}
                className="px-4 py-3 transition-all whitespace-nowrap flex-shrink-0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #8B4513' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  color: isActive ? '#8B4513' : '#8B8378',
                }}>{item.label}</div>
                <div style={{
                  fontFamily: "'Fraunces', serif", fontSize: '14px',
                  color: isActive ? '#1F1A17' : '#5C4B43',
                  fontWeight: isActive ? 500 : 400,
                }}>{item.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

const exportToMarkdown = async () => {
  const get = async (k) => {
    try {
      const r = await window.storage.get(SK(k));
      if (!r?.value) return null;
      try { return JSON.parse(r.value); } catch { return r.value; }
    } catch { return null; }
  };

  const get0 = async (k) => {
    try {
      const r = await window.storage.get(SK0(k));
      if (!r?.value) return null;
      try { return JSON.parse(r.value); } catch { return r.value; }
    } catch { return null; }
  };

  const fmt = (v) => (v && v !== '' ? v : '_(not yet answered)_');

  let md = `# GEOL 1403 — Activate Your Core Workbook\n\n`;
  md += `**Dallas College · Physical Geology**\n\n`;
  md += `*Exported: ${new Date().toLocaleString()}*\n\n---\n\n`;

  // ─── MODULE 0 ───
  md += `# Module 0 — Getting Started\n\n---\n\n`;

  md += `## §02 — Metacognition Reflection\n\n`;
  md += `**Past learning success:** ${fmt(await get0('meta:past_learning'))}\n\n`;
  md += `**Default reaction when stuck:** ${fmt(await get0('meta:stuck_reaction'))}\n\n---\n\n`;

  md += `## §03 — Pre-Course Self-Assessment\n\n`;
  md += `**Why taking GEOL 1403:** ${fmt(await get0('assess:why_taking'))}\n\n`;
  md += `**Prior knowledge of geology:** ${fmt(await get0('assess:prior_knowledge'))}\n\n`;
  md += `**Relationship with science:** ${fmt(await get0('assess:science_history'))}\n\n`;
  md += `**Study strategies that have worked / haven't:** ${fmt(await get0('assess:strategies'))}\n\n`;
  md += `**Concerns and hopes:** ${fmt(await get0('assess:concerns_hopes'))}\n\n`;
  md += `**Target outcome:** ${fmt(await get0('assess:target'))}\n\n---\n\n`;

  md += `## §05 — Foundation\n\n`;
  md += `**Course goal:** ${fmt(await get0('found:course_goal'))}\n\n`;
  md += `**Weekly study schedule:** ${fmt(await get0('found:weekly_schedule'))}\n\n`;
  md += `**Study environment:** ${fmt(await get0('found:environment'))}\n\n`;
  md += `**Support system:** ${fmt(await get0('found:support'))}\n\n`;
  md += `**Non-negotiable:** ${fmt(await get0('found:non_negotiable'))}\n\n---\n\n`;

  md += `## §06 — Carrying Forward (course-level)\n\n`;
  md += `**Already confused about / worried about:** ${fmt(await get0('lingering:confused'))}\n\n`;
  md += `**Curious about / want to understand:** ${fmt(await get0('lingering:deeper'))}\n\n---\n\n`;

  // ─── MODULE 1 ───
  md += `\n# Module 1 — The Nature of Geology\n\n---\n\n`;

  const mastered = (await get('terms:mastered')) || [];
  md += `## §01 — Key Terms\n\n`;
  md += `Mastered: **${mastered.length} / ${KEY_TERMS.length}**\n\n`;
  for (const t of KEY_TERMS) {
    const check = mastered.includes(t.term) ? '✓' : '○';
    md += `- ${check} **${t.term}** — ${t.definition}\n`;
  }
  md += `\n### Reflect on your vocabulary\n\n`;
  md += `**Challenging words:** ${fmt(await get('vocab:reflect:challenging'))}\n\n`;
  md += `**Overcoming challenges:** ${fmt(await get('vocab:reflect:overcome'))}\n\n---\n\n`;

  md += `## §02 — Module Overview & Goals\n\n`;
  md += `### Metacognitive Moment\n\n`;
  md += `**Prior knowledge:** ${fmt(await get('overview:prior_knowledge'))}\n\n`;
  md += `**Time needed:** ${fmt(await get('overview:time_needed'))}\n\n`;
  md += `**Motivation:** ${fmt(await get('overview:motivation'))}\n\n`;
  md += `### Personal Learning Goals\n\n${fmt(await get('overview:goals'))}\n\n`;
  md += `### Learning Path\n\n${fmt(await get('overview:learning_path'))}\n\n---\n\n`;

  md += `## §03 — Reading Notes & Key Questions\n\n`;
  for (let i = 0; i < READINGS.length; i++) {
    const r = READINGS[i];
    md += `### Reading ${i + 1}: ${r.title}\n`;
    md += `*${r.sections} · ${r.pages}*\n\n`;
    md += `**Notes:** ${fmt(await get(`readings:notes:${i}`))}\n\n`;
    for (let qi = 0; qi < r.questions.length; qi++) {
      md += `**Q:** ${r.questions[qi]}\n\n`;
      md += `${fmt(await get(`readings:q:${i}:${qi}`))}\n\n`;
    }
  }
  md += `### Highlights\n\n${fmt(await get('highlights:quotes'))}\n\n---\n\n`;

  md += `## §05 — Steno's Principles\n\n`;
  md += `### Before playing\n\n`;
  md += `**Prior knowledge:** ${fmt(await get('steno:before:knowledge'))}\n\n`;
  md += `**Strategy:** ${fmt(await get('steno:before:strategy'))}\n\n`;
  md += `### During the game\n\n`;
  md += `**Challenges:** ${fmt(await get('steno:during:challenges'))}\n\n`;
  md += `**Overcoming:** ${fmt(await get('steno:during:overcome'))}\n\n`;
  md += `### After playing\n\n`;
  md += `**How principles helped:** ${fmt(await get('steno:after:helped'))}\n\n`;
  md += `**Metacognition:** ${fmt(await get('steno:after:metacog'))}\n\n`;
  md += `**Gamification:** ${fmt(await get('steno:after:gamification'))}\n\n---\n\n`;

  md += `## §06 — Monitor Your Progress\n\n`;
  md += `**Strategies:** ${fmt(await get('monitor:strategies'))}\n\n`;
  md += `**Pace:** ${fmt(await get('monitor:pace'))}\n\n`;
  md += `**Understanding:** ${fmt(await get('monitor:understanding'))}\n\n---\n\n`;

  md += `## §07 — Quiz Wrapper\n\n`;
  md += `**Prep strategies:** ${fmt(await get('quiz:prep'))}\n\n`;
  md += `**Didn't work:** ${fmt(await get('quiz:not_worked'))}\n\n`;
  md += `**Strong areas:** ${fmt(await get('quiz:well'))}\n\n`;
  md += `**Error patterns:** ${fmt(await get('quiz:patterns'))}\n\n---\n\n`;

  md += `## §08 — Module Wrap-Up\n\n`;
  md += `**How well:** ${fmt(await get('wrap:how_well'))}\n\n`;
  md += `**Strategies that worked:** ${fmt(await get('wrap:strategies'))}\n\n`;
  md += `**Aha moments:** ${fmt(await get('wrap:aha'))}\n\n`;
  md += `**Revelation:** ${fmt(await get('wrap:reveal'))}\n\n`;
  md += `### Core Gallery Work Piece\n\n${fmt(await get('gallery:m1'))}\n\n---\n\n`;

  md += `## §09 — Carrying Forward\n\n`;
  md += `**Still confused about:** ${fmt(await get('lingering:confused'))}\n\n`;
  md += `**Want to go deeper on:** ${fmt(await get('lingering:deeper'))}\n\n---\n\n`;

  // ─── MODULE 2 ───
  const get2 = async (k) => {
    try {
      const r = await window.storage.get(SK2(k));
      if (!r?.value) return null;
      try { return JSON.parse(r.value); } catch { return r.value; }
    } catch { return null; }
  };

  md += `\n# Module 2 — Earth's Structure & Function\n\n---\n\n`;

  const mastered2 = (await get2('terms:mastered')) || [];
  md += `## §01 — Key Terms\n\nMastered: **${mastered2.length} / ${M2_KEY_TERMS.length}**\n\n`;
  for (const t of M2_KEY_TERMS) {
    const check = mastered2.includes(t.term) ? '✓' : '○';
    md += `- ${check} **${t.term}** — ${t.definition}\n`;
  }
  md += `\n**Challenging words:** ${fmt(await get2('vocab:reflect:challenging'))}\n\n`;
  md += `**Overcoming challenges:** ${fmt(await get2('vocab:reflect:overcome'))}\n\n---\n\n`;

  md += `## §02 — Module Overview & Goals\n\n`;
  md += `**Prior knowledge:** ${fmt(await get2('overview:prior_knowledge'))}\n\n`;
  md += `**Time needed:** ${fmt(await get2('overview:time_needed'))}\n\n`;
  md += `**Motivation:** ${fmt(await get2('overview:motivation'))}\n\n`;
  md += `### Personal Learning Goals\n\n${fmt(await get2('overview:goals'))}\n\n`;
  md += `### Learning Path\n\n${fmt(await get2('overview:learning_path'))}\n\n---\n\n`;

  md += `## §03 — Reading Notes & Key Questions\n\n`;
  for (let i = 0; i < M2_READINGS.length; i++) {
    const r = M2_READINGS[i];
    md += `### Reading ${i + 1}: ${r.title}\n*${r.sections} · ${r.pages}*\n\n`;
    md += `**Notes:** ${fmt(await get2(`readings:notes:${i}`))}\n\n`;
    for (let qi = 0; qi < r.questions.length; qi++) {
      md += `**Q:** ${r.questions[qi]}\n\n${fmt(await get2(`readings:q:${i}:${qi}`))}\n\n`;
    }
  }
  md += `### Highlights\n\n${fmt(await get2('highlights:quotes'))}\n\n---\n\n`;

  md += `## §05 — Lava Lamp & Mantle Convection\n\n`;
  md += `**Observation:** ${fmt(await get2('lava:observe'))}\n\n`;
  md += `**Convection model:** ${fmt(await get2('lava:convection'))}\n\n`;
  md += `**Plate motion:** ${fmt(await get2('lava:plates'))}\n\n`;
  md += `**Effects on boundaries:** ${fmt(await get2('lava:boundaries'))}\n\n`;
  md += `**Heat transfer:** ${fmt(await get2('lava:heat'))}\n\n`;
  md += `**Helpful aspects:** ${fmt(await get2('lava:helpful'))}\n\n`;
  md += `**Misleading aspects:** ${fmt(await get2('lava:misleading'))}\n\n`;
  md += `**Micro-extension:** ${fmt(await get2('lava:extension'))}\n\n---\n\n`;

  md += `## §06 — Continental Drift vs. Plate Tectonics\n\n`;
  const rows = ['Evidence 1', 'Evidence 2', 'Mechanism', 'Scientific Acceptance'];
  md += `| Aspect | Pre-1960s | Post-1960s |\n|---|---|---|\n`;
  for (const row of rows) {
    md += `| ${row} | ${fmt(await get2(`comp:${row}:pre`))} | ${fmt(await get2(`comp:${row}:post`))} |\n`;
  }
  md += `\n**Differentiating evidence:** ${fmt(await get2('comp:reflect:diff'))}\n\n`;
  md += `**Understanding mechanisms:** ${fmt(await get2('comp:reflect:mech'))}\n\n`;
  md += `**Scientific acceptance:** ${fmt(await get2('comp:reflect:accept'))}\n\n---\n\n`;

  md += `## §07 — Identifying Plate Boundaries\n\n`;
  const answers2 = (await get2('boundary:answers')) || {};
  for (let i = 0; i < BOUNDARY_SCENARIOS.length; i++) {
    const s = BOUNDARY_SCENARIOS[i];
    const userAns = answers2[i] || '_(not answered)_';
    md += `### ${s.name}\n*${s.description}*\n\n`;
    md += `**Your classification:** ${userAns}  \n`;
    md += `**Correct answer:** ${s.answer}\n\n`;
    md += `**Reasoning:** ${fmt(await get2(`boundary:reasoning:${i}`))}\n\n`;
  }
  md += `**Hardest scenario:** ${fmt(await get2('boundary:reflect:hardest'))}\n\n`;
  md += `**Strategy used:** ${fmt(await get2('boundary:reflect:strategy'))}\n\n---\n\n`;

  md += `## §08 — Monitor Your Progress\n\n`;
  md += `**Strategies:** ${fmt(await get2('monitor:strategies'))}\n\n`;
  md += `**Pace:** ${fmt(await get2('monitor:pace'))}\n\n`;
  md += `**Understanding:** ${fmt(await get2('monitor:understanding'))}\n\n---\n\n`;

  md += `## §09 — Quiz Wrapper\n\n`;
  md += `**Prep strategies:** ${fmt(await get2('quiz:prep'))}\n\n`;
  md += `**Didn't work:** ${fmt(await get2('quiz:not_worked'))}\n\n`;
  md += `**Strong areas:** ${fmt(await get2('quiz:well'))}\n\n`;
  md += `**Error patterns:** ${fmt(await get2('quiz:patterns'))}\n\n---\n\n`;

  md += `## §10 — Module Wrap-Up\n\n`;
  md += `**How well:** ${fmt(await get2('wrap:how_well'))}\n\n`;
  md += `**Strategies that worked:** ${fmt(await get2('wrap:strategies'))}\n\n`;
  md += `**Aha moments:** ${fmt(await get2('wrap:aha'))}\n\n`;
  md += `**Synthesis:** ${fmt(await get2('wrap:synthesize'))}\n\n`;
  md += `### Core Gallery Work Piece\n\n${fmt(await get2('gallery:m2'))}\n\n---\n\n`;

  md += `## §11 — Carrying Forward\n\n`;
  md += `**Still confused about:** ${fmt(await get2('lingering:confused'))}\n\n`;
  md += `**Want to go deeper on:** ${fmt(await get2('lingering:deeper'))}\n\n---\n\n`;

  // ─── RUNNING RECORD ───
  const allQs = await getAllLingeringQuestions();
  if (allQs.length > 0) {
    md += `\n# Running Record\n\nA complete log of every question flagged across all modules.\n\n`;
    const byMod = {};
    for (const q of allQs) {
      if (!byMod[q.originModule]) byMod[q.originModule] = [];
      byMod[q.originModule].push(q);
    }
    for (const mod of Object.keys(byMod).sort((a, b) => Number(a) - Number(b))) {
      md += `## Module ${String(mod).padStart(2, '0')}\n\n`;
      for (const q of byMod[mod]) {
        const status = q.status === 'resolved' ? `✓ Resolved in M${q.resolvedInModule}` : 'Open';
        md += `- **[${status}]** _${q.type}_: ${q.text}\n`;
        if (Object.keys(q.responses).length > 0) {
          for (const [m, resp] of Object.entries(q.responses).sort()) {
            md += `  - ${m.toUpperCase()} follow-up: ${resp}\n`;
          }
        }
      }
      md += `\n`;
    }
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GEOL1403_Notebook_${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────

export default function GeolNotebook() {
  const [exportState, setExportState] = useState('idle');
  const [view, setView] = useState('m0');

  const handleExport = async () => {
    setExportState('exporting');
    try {
      await exportToMarkdown();
      setExportState('done');
      setTimeout(() => setExportState('idle'), 2000);
    } catch (e) {
      setExportState('idle');
    }
  };

  const meta = MODULE_META[view];

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#FAF6EE',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(181, 83, 42, 0.025) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(74, 93, 63, 0.025) 0%, transparent 50%)
        `,
        fontFamily: "'Newsreader', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap');
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF6EE]/85 border-b border-stone-300/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-0.5">
              GEOL 1403 · Activate Your Core
            </div>
            <h1 className="text-xl text-stone-900 leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
              {meta.number != null ? `Module ${String(meta.number).padStart(2, '0')} — ${meta.title}` : meta.title}
            </h1>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase rounded-sm whitespace-nowrap transition-colors"
            style={{
              fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              backgroundColor: '#1F1A17',
              color: '#FAF6EE',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3D3631'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1F1A17'; }}
          >
            <Download size={14} style={{ color: '#FAF6EE' }} />
            {exportState === 'exporting' ? 'Exporting…' : exportState === 'done' ? 'Downloaded ✓' : 'Export Notebook'}
          </button>
        </div>
        <ModuleNav active={view} onChange={setView} />
      </header>

      {/* Welcome banner — only shown for module views, not the running record */}
      {view !== 'log' && (
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
          <div className="border-l-4 border-[#8B4513] pl-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B4513] mb-2 font-semibold">
              An active learning notebook
            </p>
            <p className="text-stone-800 leading-relaxed max-w-2xl" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: '16.5px' }}>
              {view === 'm0'
                ? "Before diving into the geology, take a moment to set yourself up. This orientation explains how the notebook works, why metacognition matters, and helps you map out what you want from this course."
                : view === 'm1'
                ? "This module helps you build a foundation in how geologists think, how Earth's systems interconnect, and the principles that let us read time in stone. Move at your own pace — your responses save automatically."
                : "This module digs into the engine that drives Earth's surface: plate tectonics, volcanoes, earthquakes, and the layered structure of Earth's interior. Your responses save automatically."}
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {view === 'm0' && <Module0View />}
        {view === 'm1' && <Module1View />}
        {view === 'm2' && <Module2View />}
        {view === 'log' && <RunningRecord />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300/60 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-500 leading-relaxed max-w-md">
            <span className="uppercase tracking-wider text-stone-600 font-semibold">Dallas College</span> · GEOL 1403 Physical Geology · Activate Your Core Workbook
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase rounded-sm transition-colors"
            style={{
              fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              backgroundColor: 'transparent',
              color: '#1F1A17',
              border: '1px solid #1F1A17',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1F1A17';
              e.currentTarget.style.color = '#FAF6EE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1F1A17';
            }}
          >
            <Download size={14} />
            Export to Markdown
          </button>
        </div>
      </footer>
    </div>
  );
}
