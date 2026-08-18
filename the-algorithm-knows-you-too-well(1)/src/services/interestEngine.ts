import {
  Reel,
  InterestScore,
  SubtopicScore,
  InterestGraphNode,
  InterestGraphLink,
  RecommendationOutput,
  UserFeedbackState,
  AnalysisSummary,
  ContentQualityBreakdown,
  FeedbackActionType,
} from '../types';
import { CANDIDATE_RECOMMENDATIONS } from '../data/sampleReels';

/**
 * Calculates deterministic interaction score for a Reel from user behavioral telemetry
 */
export function calculateReelInteractionScore(reel: Reel): number {
  let score = 0;
  const b = reel.behavior;

  // Watch completion ratio (0 - 2.0 pts)
  score += (b.watchedPct / 100) * 2.0;

  // High watch completion bonus
  if (b.watchedPct >= 95) score += 2.5;
  else if (b.watchedPct >= 85) score += 1.5;
  else if (b.watchedPct >= 70) score += 0.5;

  // Explicit positive intent
  if (b.liked) score += 2.0;
  if (b.saved) score += 4.0; // High intentionality / bookmarking for later
  if (b.replay) score += 3.0; // High comprehension / joy
  if (b.shared) score += 4.0;

  // Negative intent penalties
  if (b.skippedEarly || b.watchedPct < 40) {
    score -= 3.0;
  }

  return Math.max(0, Math.round(score * 10) / 10);
}

/**
 * Multi-dimensional Content Quality & Rigor Evaluator
 * Assesses: Technical Accuracy, Depth of Explanation, Educational Value, and Hype Penalty
 */
export function calculateContentQuality(
  title: string,
  content: string,
  tags: string[] = [],
  hypeRisk: 'Low' | 'Medium' | 'High' = 'Low'
): ContentQualityBreakdown {
  const combined = `${title} ${content} ${tags.join(' ')}`.toLowerCase();

  let techAcc = 78; // baseline
  let depth = 75;
  let edu = 80;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Deep technical indicators
  if (
    combined.includes('complexity') ||
    combined.includes('o(log n)') ||
    combined.includes('b-tree') ||
    combined.includes('hash map') ||
    combined.includes('cache') ||
    combined.includes('tls') ||
    combined.includes('handshake') ||
    combined.includes('microarchitecture') ||
    combined.includes('vector') ||
    combined.includes('hnsw') ||
    combined.includes('actor model') ||
    combined.includes('concurrency')
  ) {
    techAcc += 16;
    depth += 18;
    edu += 14;
    strengths.push('Grounds explanations in real computer science theory and production mechanics');
  }

  if (
    combined.includes('under the hood') ||
    combined.includes('actually work') ||
    combined.includes('impact') ||
    combined.includes('trade-off') ||
    combined.includes('scaled to') ||
    combined.includes('benchmark')
  ) {
    depth += 12;
    edu += 10;
    strengths.push('Focuses on architectural trade-offs rather than syntax trivia');
  }

  if (
    combined.includes('animated') ||
    combined.includes('visual') ||
    combined.includes('diagram') ||
    combined.includes('step by step') ||
    combined.includes('takeaways')
  ) {
    edu += 12;
    strengths.push('High pedagogical retention through visual mental models');
  }

  // Detect clickbait / superficial patterns
  let hypePenalty = 0;
  if (hypeRisk === 'High') {
    hypePenalty = 45;
    techAcc -= 35;
    depth -= 40;
    edu -= 35;
    weaknesses.push('High sensationalism and unsubstantiated career shortcut claims');
  } else if (hypeRisk === 'Medium') {
    hypePenalty = 20;
    techAcc -= 12;
    depth -= 15;
    edu -= 10;
    weaknesses.push('Contains minor listicle phrasing with limited architectural depth');
  } else {
    strengths.push('Zero clickbait triggers; high signal-to-noise ratio');
  }

  // Bound individual metrics
  const technicalAccuracy = Math.min(99, Math.max(20, Math.round(techAcc)));
  const depthOfExplanation = Math.min(99, Math.max(15, Math.round(depth)));
  const educationalValue = Math.min(99, Math.max(20, Math.round(edu)));

  // Weighted composite score
  const rawComposite =
    technicalAccuracy * 0.35 +
    depthOfExplanation * 0.35 +
    educationalValue * 0.30 -
    hypePenalty * 0.2;
  const compositeScore = Math.min(99, Math.max(25, Math.round(rawComposite)));

  let qualityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' = 'B';
  let verdict = 'Good educational technical content with solid conceptual clarity.';

  if (compositeScore >= 93) {
    qualityGrade = 'A+';
    verdict = 'Exceptional computer science rigor with deep systems explanation.';
  } else if (compositeScore >= 84) {
    qualityGrade = 'A';
    verdict = 'High-value engineering content with actionable mental models.';
  } else if (compositeScore >= 74) {
    qualityGrade = 'B+';
    verdict = 'Solid technical overview with practical application.';
  } else if (compositeScore >= 60) {
    qualityGrade = 'B';
    verdict = 'Decent introductory material; moderate conceptual depth.';
  } else if (compositeScore >= 45) {
    qualityGrade = 'C';
    verdict = 'Superficial content; contains high buzzword density.';
  } else {
    qualityGrade = 'D';
    verdict = 'Engagement bait / low technical substance filtered by quality system.';
  }

  return {
    technicalAccuracy,
    depthOfExplanation,
    educationalValue,
    hypePenalty,
    compositeScore,
    qualityGrade,
    verdict,
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : undefined,
  };
}

/**
 * Hype detector for Reels or candidate recommendations
 */
export function detectHypePattern(title: string, content: string): {
  isHype: boolean;
  hypeRisk: 'Low' | 'Medium' | 'High';
  hypeScore: number;
  patterns: string[];
} {
  const text = `${title} ${content}`.toLowerCase();
  const patterns: string[] = [];
  let score = 5; // baseline low

  const hypePhrases = [
    { phrase: 'guarantee', pattern: 'Guaranteed outcome promise', weight: 40 },
    { phrase: 'get you a job', pattern: 'Unrealistic career shortcut', weight: 35 },
    { phrase: 'make $', pattern: 'Income guarantee hook', weight: 45 },
    { phrase: 'this one tool', pattern: 'Silver bullet tool claim', weight: 30 },
    { phrase: 'feel illegal', pattern: 'Clickbait curiosity trap', weight: 25 },
    { phrase: 'replace you', pattern: 'Fear-based career bait', weight: 35 },
    { phrase: '10 ai tools', pattern: 'Superficial listicle format', weight: 30 },
    { phrase: 'in 10 seconds', pattern: 'Instant mastery exaggeration', weight: 25 },
    { phrase: 'passive income', pattern: 'Spam financial claim', weight: 40 },
    { phrase: 'secret trick', pattern: 'Curiosity gap clickbait', weight: 20 },
  ];

  for (const item of hypePhrases) {
    if (text.includes(item.phrase)) {
      patterns.push(item.pattern);
      score += item.weight;
    }
  }

  score = Math.min(100, Math.max(0, score));
  const hypeRisk = score > 60 ? 'High' : score > 25 ? 'Medium' : 'Low';
  return {
    isHype: score > 30,
    hypeRisk,
    hypeScore: score,
    patterns,
  };
}

/**
 * Infer Latent and Direct Interests from current Reel feed with full Sub-topic Hierarchy
 */
export function analyzeUserInterests(
  reels: Reel[],
  feedback?: UserFeedbackState
): {
  interestScores: InterestScore[];
  summary: AnalysisSummary;
  graphNodes: InterestGraphNode[];
  graphLinks: InterestGraphLink[];
} {
  if (!reels || reels.length === 0) {
    return {
      interestScores: [],
      summary: {
        headlineDiscovery: 'NO ACTIVITY RECORDED',
        primaryInterest: 'Insufficient Evidence',
        directInterestComparison: {
          naiveKeywordConclusion: 'No data',
          latentAIConclusion: 'Watch or interact with reels to generate behavioral signals.',
        },
        behavioralStrengthSummary: 'Empty feed',
        evidenceItems: ['No reels in current history.'],
        topInterests: [],
        hypeFilteredCount: 0,
        averageQualityScore: 0,
        topSubtopics: [],
      },
      graphNodes: [
        {
          id: 'user',
          label: 'STUDENT PROFILE',
          group: 'root',
          category: 'Root',
          depth: 0,
          score: 100,
          strength: 1.0,
          reasoning: 'Active student profile with zero telemetry',
          sources: [],
        },
      ],
      graphLinks: [],
    };
  }

  // Accumulate scores for key tech domains and sub-topics
  let softwareEngPoints = 0;
  let backendPoints = 0;
  let devopsPoints = 0;
  let frontendPoints = 0;

  let programmingPoints = 0;
  let pythonPoints = 0;
  let jsTsPoints = 0;
  let javaDirectPoints = 0;

  let dsaPoints = 0;
  let divideConquerPoints = 0;
  let dataStructuresPoints = 0;
  let complexityPoints = 0;

  let devCareerPoints = 0;

  let hardwarePoints = 0;
  let cpuCachePoints = 0;
  let gpuPoints = 0;

  let cybersecurityPoints = 0;
  let cryptoTlsPoints = 0;
  let appSecPoints = 0;

  let aiPoints = 0;
  let vectorRagPoints = 0;
  let neuralPoints = 0;

  let systemDesignPoints = 0;

  const evidenceMap: Record<string, string[]> = {
    'Software Engineering': [],
    'Backend Development': [],
    'DevOps & SRE': [],
    'Programming': [],
    'Python Ecosystem': [],
    'JavaScript / TypeScript': [],
    'Java': [],
    'DSA / Problem Solving': [],
    'Divide & Conquer': [],
    'Data Structures': [],
    'Developer Career': [],
    'Computer Technology / Hardware': [],
    'CPU Caching & Memory': [],
    'Cybersecurity': [],
    'Cryptography & TLS': [],
    'Artificial Intelligence': [],
    'Vector DBs & RAG': [],
  };

  let hypeFilteredCount = 0;
  let totalQualityScore = 0;

  reels.forEach((reel) => {
    const rawScore = calculateReelInteractionScore(reel);
    const hype = reel.hypeClassification || detectHypePattern(reel.title, reel.content);
    const quality =
      reel.qualityBreakdown ||
      calculateContentQuality(reel.title, reel.content, reel.semanticTags, hype.hypeRisk);

    totalQualityScore += quality.compositeScore;

    // Strict or normal hype penalty
    if (hype.isHype && hype.hypeRisk === 'High') {
      hypeFilteredCount++;
      if (feedback?.hypeStrictness === 'Strict' || feedback?.hypeStrictness === 'Ultra') {
        // Ultra-strict mode heavily ignores high-hype content
        return;
      }
      if (!reel.behavior.liked && !reel.behavior.saved) {
        aiPoints += rawScore * 0.05;
        return;
      }
    }

    // Java meme synthesis
    if (reel.title.toLowerCase().includes('java') || reel.category === 'Programming Meme') {
      javaDirectPoints += rawScore * 0.55;
      programmingPoints += rawScore * 0.9;
      softwareEngPoints += rawScore * 1.15; // Java memes are strong evidence of software engineering culture!
      backendPoints += rawScore * 0.8;
      devopsPoints += rawScore * 0.5;

      evidenceMap['Software Engineering'].push(`High engagement with developer culture & compilation memes (${reel.title})`);
      evidenceMap['Programming'].push(`Interacted with syntax & compiler humor (${reel.title})`);
      evidenceMap['Java'].push(`Mentioned Java explicitly (${reel.title})`);
      evidenceMap['Backend Development'].push(`Observed backend enterprise language paradigm and runtime debugging`);
    }

    // Developer career & workplace
    if (
      reel.category === 'Developer Career' ||
      reel.semanticTags.includes('Career') ||
      reel.semanticTags.includes('Git Workflow')
    ) {
      devCareerPoints += rawScore * 1.25;
      softwareEngPoints += rawScore * 1.3;
      devopsPoints += rawScore * 1.1;
      backendPoints += rawScore * 0.75;
      frontendPoints += rawScore * 0.5;

      evidenceMap['Developer Career'].push(`Saved/watched lifestyle & production workflow reel (${reel.title})`);
      evidenceMap['Software Engineering'].push(`Engaged with team collaboration & Git lifecycle signals`);
      evidenceMap['DevOps & SRE'].push(`High affinity for Git branching, deployment pipelines, and code reviews`);
    }

    // Coding interviews & DSA
    if (
      reel.category === 'DSA' ||
      reel.category === 'Career / Programming' ||
      reel.semanticTags.includes('DSA') ||
      reel.title.toLowerCase().includes('interview') ||
      reel.title.toLowerCase().includes('search')
    ) {
      dsaPoints += rawScore * 1.4;
      softwareEngPoints += rawScore * 0.9;
      devCareerPoints += rawScore * 0.7;

      if (reel.title.toLowerCase().includes('binary search') || reel.semanticTags.includes('Divide & Conquer')) {
        divideConquerPoints += rawScore * 1.5;
        complexityPoints += rawScore * 1.3;
        evidenceMap['Divide & Conquer'].push(`Replayed algorithmic divide-and-conquer visualization (${reel.title})`);
      } else {
        dataStructuresPoints += rawScore * 1.2;
        evidenceMap['Data Structures'].push(`Engaged with interview data structures and algorithmic patterns`);
      }

      evidenceMap['DSA / Problem Solving'].push(`Replayed/Saved interview algorithms & complexity analysis (${reel.title})`);
      evidenceMap['Software Engineering'].push(`Observed algorithmic preparation for engineering roles`);
    }

    // Hardware & Silicon
    if (
      reel.category === 'Hardware' ||
      reel.semanticTags.includes('Laptop GPU') ||
      reel.title.toLowerCase().includes('rtx') ||
      reel.title.toLowerCase().includes('cpu')
    ) {
      hardwarePoints += rawScore * 1.3;
      cpuCachePoints += rawScore * 1.1;
      gpuPoints += rawScore * 1.2;
      systemDesignPoints += rawScore * 0.5;

      evidenceMap['Computer Technology / Hardware'].push(`Saved hardware benchmarks & workstation specs (${reel.title})`);
      evidenceMap['CPU Caching & Memory'].push(`Interest in silicon architecture and processing throughput`);
    }

    // Cybersecurity
    if (
      reel.category === 'Cybersecurity' ||
      reel.semanticTags.includes('HTTPS') ||
      reel.semanticTags.includes('Security')
    ) {
      cybersecurityPoints += rawScore * 1.3;
      cryptoTlsPoints += rawScore * 1.4;
      appSecPoints += rawScore * 1.0;
      softwareEngPoints += rawScore * 0.6;
      backendPoints += rawScore * 0.7;

      evidenceMap['Cybersecurity'].push(`Saved visual cryptography & TLS protocol walkthrough (${reel.title})`);
      evidenceMap['Cryptography & TLS'].push(`Deep interest in asymmetric cryptography and network handshakes`);
    }

    // Legitimate AI vs filtered hype
    if (reel.category === 'AI / Career' || reel.category === 'AI Engineering') {
      if (!hype.isHype || reel.behavior.liked) {
        aiPoints += rawScore * 1.1;
        vectorRagPoints += rawScore * 1.2;
        neuralPoints += rawScore * 0.9;
        evidenceMap['Artificial Intelligence'].push(`Engaged with technical AI foundations (${reel.title})`);
        evidenceMap['Vector DBs & RAG'].push(`Curiosity about semantic embeddings and indexing algorithms`);
      }
    }
  });

  // Base fallback activity if zero
  if (pythonPoints === 0) pythonPoints = (programmingPoints * 0.6) + (dsaPoints * 0.4);
  if (jsTsPoints === 0) jsTsPoints = (programmingPoints * 0.65) + (devCareerPoints * 0.4);
  if (backendPoints === 0) backendPoints = softwareEngPoints * 0.75;
  if (devopsPoints === 0) devopsPoints = softwareEngPoints * 0.65;
  if (divideConquerPoints === 0) divideConquerPoints = dsaPoints * 0.8;
  if (dataStructuresPoints === 0) dataStructuresPoints = dsaPoints * 0.75;
  if (cpuCachePoints === 0) cpuCachePoints = hardwarePoints * 0.7;
  if (cryptoTlsPoints === 0) cryptoTlsPoints = cybersecurityPoints * 0.8;
  if (vectorRagPoints === 0) vectorRagPoints = aiPoints * 0.75;

  // Apply user feedback boosts (Category level & Subtopic level)
  if (feedback?.categoryBoosts) {
    Object.entries(feedback.categoryBoosts).forEach(([cat, boostVal]) => {
      if (cat === 'DSA') {
        dsaPoints += boostVal * 4.5;
        divideConquerPoints += boostVal * 3.5;
        dataStructuresPoints += boostVal * 3.5;
      } else if (cat === 'Software Engineering') {
        softwareEngPoints += boostVal * 4.5;
        backendPoints += boostVal * 3.5;
        devopsPoints += boostVal * 3.0;
      } else if (cat === 'Cybersecurity') {
        cybersecurityPoints += boostVal * 4.5;
        cryptoTlsPoints += boostVal * 4.0;
      } else if (cat === 'Hardware' || cat === 'Architecture') {
        hardwarePoints += boostVal * 4.5;
        cpuCachePoints += boostVal * 4.0;
      } else if (cat === 'AI') {
        aiPoints += boostVal * 4.5;
        vectorRagPoints += boostVal * 4.0;
      } else if (cat === 'Programming') {
        programmingPoints += boostVal * 4.0;
        pythonPoints += boostVal * 3.0;
        jsTsPoints += boostVal * 3.0;
      }
    });
  }

  if (feedback?.subtopicBoosts) {
    Object.entries(feedback.subtopicBoosts).forEach(([sub, boostVal]) => {
      if (sub.includes('Backend')) backendPoints += boostVal * 5;
      if (sub.includes('DevOps')) devopsPoints += boostVal * 5;
      if (sub.includes('Divide')) divideConquerPoints += boostVal * 5;
      if (sub.includes('Trees') || sub.includes('Data Structures')) dataStructuresPoints += boostVal * 5;
      if (sub.includes('Vector') || sub.includes('RAG')) vectorRagPoints += boostVal * 5;
      if (sub.includes('Python')) pythonPoints += boostVal * 5;
      if (sub.includes('Crypto') || sub.includes('TLS')) cryptoTlsPoints += boostVal * 5;
    });
  }

  // Cross-pollination / Latent synthesis:
  // If user likes programming + career + DSA + hardware => Software Engineering gets a massive synthesis multiplier!
  const hasMultimodalDevSignals = programmingPoints > 5 && (devCareerPoints > 5 || dsaPoints > 5);
  if (hasMultimodalDevSignals) {
    softwareEngPoints *= 1.3;
    backendPoints *= 1.25;
    evidenceMap['Software Engineering'].push(
      'Cross-topic convergence: Combined programming, interview prep, and hardware signals into a unified Software Engineering profile.'
    );
  }

  // Normalize scores to 0 - 100 scale
  const maxPossible = 30;
  const toPct = (val: number, cap: number = 96, floor: number = 15) =>
    Math.min(cap, Math.max(floor, Math.round((val / maxPossible) * 100)));

  const seScore = toPct(softwareEngPoints, 92);
  const progScore = toPct(programmingPoints, 78);
  const dsaScore = toPct(dsaPoints, 74);
  const hwScore = toPct(hardwarePoints, 56);
  const aiScore = toPct(aiPoints, 38);
  const javaScore = toPct(javaDirectPoints, 33);
  const cyberScore = toPct(cybersecurityPoints, 52);
  const careerScore = toPct(devCareerPoints, 76);

  // Sub-topic Scores
  const backendScore = toPct(backendPoints, 88);
  const devopsScore = toPct(devopsPoints, 78);
  const frontendScore = toPct(frontendPoints, 54);

  const pythonScore = toPct(pythonPoints, 72);
  const jsTsScore = toPct(jsTsPoints, 70);
  const javaJvmScore = toPct(javaDirectPoints, 48);

  const divConquerScore = toPct(divideConquerPoints, 90);
  const dataStructScore = toPct(dataStructuresPoints, 82);
  const complexityScore = toPct(complexityPoints, 84);

  const cpuCacheScore = toPct(cpuCachePoints, 76);
  const gpuScore = toPct(gpuPoints, 68);

  const cryptoTlsScore = toPct(cryptoTlsPoints, 78);
  const appSecScore = toPct(appSecPoints, 64);

  const vectorRagScore = toPct(vectorRagPoints, 80);
  const neuralScore = toPct(neuralPoints, 58);

  const getLevel = (val: number): 'Very High' | 'High' | 'Medium' | 'Low' => {
    if (val >= 80) return 'Very High';
    if (val >= 65) return 'High';
    if (val >= 45) return 'Medium';
    return 'Low';
  };

  const seSubtopics: SubtopicScore[] = [
    {
      id: 'se-backend',
      parentCategory: 'Software Engineering',
      name: 'Backend Development',
      score: backendScore,
      level: getLevel(backendScore),
      description: 'API design, high-throughput database queries, microservices, and server concurrency.',
      signals: ['Compilation debugging memes', 'Production Git deployments', 'Database performance'],
    },
    {
      id: 'se-devops',
      parentCategory: 'Software Engineering',
      name: 'DevOps & SRE',
      score: devopsScore,
      level: getLevel(devopsScore),
      description: 'Continuous Integration, Git branch hygiene, containerization, and production reliability.',
      signals: ['First-week engineer lifestyle', 'Late-night deployment jokes', 'Git commit history'],
    },
    {
      id: 'se-frontend',
      parentCategory: 'Software Engineering',
      name: 'Frontend & Fullstack Systems',
      score: frontendScore,
      level: getLevel(frontendScore),
      description: 'Component lifecycles, state management, and modern client architecture.',
      signals: ['Developer workstation setup', 'Fullstack workflow'],
    },
  ];

  const progSubtopics: SubtopicScore[] = [
    {
      id: 'prog-python',
      parentCategory: 'Programming',
      name: 'Python Ecosystem',
      score: pythonScore,
      level: getLevel(pythonScore),
      description: 'Data science scripting, PyTorch frameworks, and backend microservices.',
      signals: ['Algorithmic problem solving', 'Vector embedding implementations'],
    },
    {
      id: 'prog-jsts',
      parentCategory: 'Programming',
      name: 'JavaScript & TypeScript',
      score: jsTsScore,
      level: getLevel(jsTsScore),
      description: 'Node.js event loop, asynchronous IO, and type-safe systems.',
      signals: ['Web security protocols', 'Production fullstack pipelines'],
    },
    {
      id: 'prog-java',
      parentCategory: 'Programming',
      name: 'Java & JVM Ecosystem',
      score: javaJvmScore,
      level: getLevel(javaJvmScore),
      description: 'Object-Oriented design, garbage collection tuning, and enterprise backends.',
      signals: ['Compiler jokes', 'Syntax satire'],
    },
  ];

  const dsaSubtopics: SubtopicScore[] = [
    {
      id: 'dsa-divide',
      parentCategory: 'DSA / Problem Solving',
      name: 'Divide & Conquer',
      score: divConquerScore,
      level: getLevel(divConquerScore),
      description: 'Binary search, logarithmic partition algorithms, and recursive trees.',
      signals: ['Binary search animation (98% watch time & replay)', 'LeetCode interview prep'],
    },
    {
      id: 'dsa-structures',
      parentCategory: 'DSA / Problem Solving',
      name: 'Data Structures (Trees & Hash Maps)',
      score: dataStructScore,
      level: getLevel(dataStructScore),
      description: 'B-Trees, Hash collision mechanics, memory caching, and indexing.',
      signals: ['Coding interview advice reel', 'Complexity analysis'],
    },
    {
      id: 'dsa-complexity',
      parentCategory: 'DSA / Problem Solving',
      name: 'Time & Space Complexity',
      score: complexityScore,
      level: getLevel(complexityScore),
      description: 'Big-O asymptotics, worst-case memory bounds, and cache optimization.',
      signals: ['Saved interview preparation video', 'Algorithmic efficiency'],
    },
  ];

  const hwSubtopics: SubtopicScore[] = [
    {
      id: 'hw-cache',
      parentCategory: 'Computer Technology / Hardware',
      name: 'CPU Caching & Memory Hierarchy',
      score: cpuCacheScore,
      level: getLevel(cpuCacheScore),
      description: 'L1/L2/L3 cache misses, spatial/temporal locality, and RAM bus bandwidth.',
      signals: ['Hardware benchmark comparisons', 'Algorithmic efficiency overlap'],
    },
    {
      id: 'hw-gpu',
      parentCategory: 'Computer Technology / Hardware',
      name: 'GPU & Silicon Acceleration',
      score: gpuScore,
      level: getLevel(gpuScore),
      description: 'CUDA cores, VRAM bandwidth, thermal throttling, and parallel compute.',
      signals: ['RTX 5070 vs 5060 benchmark saved (94% watch)'],
    },
  ];

  const cyberSubtopics: SubtopicScore[] = [
    {
      id: 'cyber-crypto',
      parentCategory: 'Cybersecurity',
      name: 'Cryptography & TLS Protocols',
      score: cryptoTlsScore,
      level: getLevel(cryptoTlsScore),
      description: 'Asymmetric encryption, public key infrastructure, and cryptographic handshakes.',
      signals: ['HTTPS/TLS animation saved (82% watch)'],
    },
    {
      id: 'cyber-appsec',
      parentCategory: 'Cybersecurity',
      name: 'Application & Network Security',
      score: appSecScore,
      level: getLevel(appSecScore),
      description: 'Zero-trust architecture, buffer overflow defenses, and token security.',
      signals: ['Production deployment workflows', 'Network packet inspection'],
    },
  ];

  const aiSubtopics: SubtopicScore[] = [
    {
      id: 'ai-vector',
      parentCategory: 'Artificial Intelligence',
      name: 'Vector Embeddings & RAG',
      score: vectorRagScore,
      level: getLevel(vectorRagScore),
      description: 'HNSW graph search, high-dimensional cosine similarity, and semantic retrieval.',
      signals: ['Mathematical algorithm appreciation', 'Filtered non-hype technical AI'],
    },
    {
      id: 'ai-neural',
      parentCategory: 'Artificial Intelligence',
      name: 'Neural Architectures',
      score: neuralScore,
      level: getLevel(neuralScore),
      description: 'Transformer attention matrices, model weights, and compute scaling.',
      signals: ['Computer science foundations', 'Demoted superficial listicles'],
    },
  ];

  const interestScores: InterestScore[] = [
    {
      category: 'Software Engineering',
      score: seScore,
      level: getLevel(seScore),
      isLatent: true,
      directEvidenceCount: evidenceMap['Software Engineering'].length,
      description:
        'Latent synthesis of programming memes, developer lifestyle, interview preparation, and computing hardware.',
      evidenceSourceIds: ['reel-01', 'reel-02', 'reel-03', 'reel-04'],
      subtopics: seSubtopics,
    },
    {
      category: 'Programming',
      score: progScore,
      level: getLevel(progScore),
      isLatent: false,
      directEvidenceCount: evidenceMap['Programming'].length,
      description: 'Foundational interest in code syntax, debugging, and software craft across languages.',
      evidenceSourceIds: ['reel-01', 'reel-03', 'reel-04'],
      subtopics: progSubtopics,
    },
    {
      category: 'Developer Career',
      score: careerScore,
      level: getLevel(careerScore),
      isLatent: true,
      directEvidenceCount: evidenceMap['Developer Career'].length,
      description: 'Industry readiness, interview strategy, code reviews, and junior-to-senior transition.',
      evidenceSourceIds: ['reel-02', 'reel-03'],
    },
    {
      category: 'DSA / Problem Solving',
      score: dsaScore,
      level: getLevel(dsaScore),
      isLatent: false,
      directEvidenceCount: evidenceMap['DSA / Problem Solving'].length,
      description: 'Algorithmic efficiency, time complexity, binary search, and analytical problem solving.',
      evidenceSourceIds: ['reel-03', 'reel-07'],
      subtopics: dsaSubtopics,
    },
    {
      category: 'Computer Technology / Hardware',
      score: hwScore,
      level: getLevel(hwScore),
      isLatent: false,
      directEvidenceCount: evidenceMap['Computer Technology / Hardware'].length,
      description: 'GPU benchmarks, laptop thermals, CPU caching, and developer workstation hardware.',
      evidenceSourceIds: ['reel-05'],
      subtopics: hwSubtopics,
    },
    {
      category: 'Cybersecurity',
      score: cyberScore,
      level: getLevel(cyberScore),
      isLatent: false,
      directEvidenceCount: evidenceMap['Cybersecurity'].length,
      description: 'Encryption, TLS handshakes, network security, and secure communication protocols.',
      evidenceSourceIds: ['reel-08'],
      subtopics: cyberSubtopics,
    },
    {
      category: 'Artificial Intelligence',
      score: aiScore,
      level: getLevel(aiScore),
      isLatent: false,
      directEvidenceCount: evidenceMap['Artificial Intelligence'].length,
      description: 'Emerging tech interest (filtered for educational value vs superficial hype listicles).',
      evidenceSourceIds: ['reel-06'],
      subtopics: aiSubtopics,
    },
    {
      category: 'Java (Direct Keyword)',
      score: javaScore,
      level: getLevel(javaScore),
      isLatent: false,
      directEvidenceCount: evidenceMap['Java'].length,
      description:
        'Surface-level language keyword presence from memes, representing a tool rather than whole identity.',
      evidenceSourceIds: ['reel-01', 'reel-04'],
    },
  ].sort((a, b) => b.score - a.score);

  // Collect all top sub-topics across categories
  const allSubtopics = [
    ...seSubtopics,
    ...progSubtopics,
    ...dsaSubtopics,
    ...hwSubtopics,
    ...cyberSubtopics,
    ...aiSubtopics,
  ].sort((a, b) => b.score - a.score);

  // Build Comprehensive Hierarchical Graph Nodes & Links
  const graphNodes: InterestGraphNode[] = [
    // Root Node (Depth 0)
    {
      id: 'user',
      label: 'STUDENT PROFILE',
      group: 'root',
      category: 'Root',
      depth: 0,
      score: 100,
      strength: 1.0,
      reasoning: 'Aggregated behavioral telemetry across short-form Reels with watch duration, saves, likes & replays.',
      sources: reels.map((r) => r.reelNumber),
    },

    // Primary Domains (Depth 1)
    {
      id: 'se',
      label: 'Software Engineering',
      group: 'primary',
      category: 'Software Engineering',
      depth: 1,
      parentId: 'user',
      children: ['sub-se-backend', 'sub-se-devops', 'sub-se-frontend'],
      score: seScore,
      strength: seScore / 100,
      reasoning:
        'Discovered as the primary latent interest unifying coding memes, developer lifestyle, interview prep, and hardware benchmarks.',
      sources: ['REEL 01', 'REEL 02', 'REEL 03', 'REEL 04', 'REEL 05'],
      subtopics: ['Backend Development', 'DevOps & SRE', 'Frontend & Fullstack'],
    },
    {
      id: 'prog',
      label: 'Programming Languages',
      group: 'primary',
      category: 'Programming',
      depth: 1,
      parentId: 'user',
      children: ['sub-prog-python', 'sub-prog-jsts', 'sub-prog-java'],
      score: progScore,
      strength: progScore / 100,
      reasoning: 'Derived from high completion on compiler celebration and syntax debugging jokes.',
      sources: ['REEL 01', 'REEL 04'],
      subtopics: ['Python', 'JavaScript & TypeScript', 'Java / JVM'],
    },
    {
      id: 'dsa',
      label: 'DSA & Algorithms',
      group: 'primary',
      category: 'DSA',
      depth: 1,
      parentId: 'user',
      children: ['sub-dsa-divide', 'sub-dsa-structs', 'sub-dsa-complex'],
      score: dsaScore,
      strength: dsaScore / 100,
      reasoning: 'Replayed binary search visualization (98% watch) and saved LeetCode advice.',
      sources: ['REEL 03', 'REEL 07'],
      subtopics: ['Divide & Conquer', 'Trees & Hash Maps', 'Time & Space Complexity'],
    },
    {
      id: 'hardware',
      label: 'Computing Hardware',
      group: 'secondary',
      category: 'Hardware',
      depth: 1,
      parentId: 'user',
      children: ['sub-hw-cache', 'sub-hw-gpu'],
      score: hwScore,
      strength: hwScore / 100,
      reasoning: 'Watched 94% of RTX laptop comparison and saved to bookmarks.',
      sources: ['REEL 05'],
      subtopics: ['CPU Caching & Memory Hierarchy', 'GPU & Silicon Acceleration'],
    },
    {
      id: 'cyber',
      label: 'Cybersecurity & Networks',
      group: 'secondary',
      category: 'Cybersecurity',
      depth: 1,
      parentId: 'user',
      children: ['sub-cyber-crypto', 'sub-cyber-appsec'],
      score: cyberScore,
      strength: cyberScore / 100,
      reasoning: 'Saved HTTPS / TLS encryption animation with 82% watch time.',
      sources: ['REEL 08'],
      subtopics: ['Cryptography & TLS', 'Application & Network Security'],
    },
    {
      id: 'ai',
      label: 'AI & ML (Non-Hype)',
      group: 'secondary',
      category: 'AI',
      depth: 1,
      parentId: 'user',
      children: ['sub-ai-vector', 'sub-ai-neural'],
      score: aiScore,
      strength: aiScore / 100,
      reasoning: 'Evaluated low-value listicle engagement; prioritized rigorous computer science foundations over hype.',
      sources: ['REEL 06 (Filtered)'],
      subtopics: ['Vector DBs & RAG', 'Neural Architectures'],
    },
    {
      id: 'java',
      label: 'Java (Keyword Artifact)',
      group: 'subtopic',
      category: 'Java',
      depth: 2,
      parentId: 'prog',
      score: javaScore,
      strength: javaScore / 100,
      reasoning: 'Direct keyword present in memes. Correctly classified as an artifact rather than sole interest.',
      sources: ['REEL 01', 'REEL 04'],
    },

    // Sub-topics under Software Engineering (Depth 2)
    {
      id: 'sub-se-backend',
      label: 'Backend Development',
      group: 'subtopic',
      category: 'Software Engineering',
      depth: 2,
      parentId: 'se',
      score: backendScore,
      strength: backendScore / 100,
      reasoning: 'Inferred from server lifecycle jokes, compiler handling, and database interest.',
      sources: ['REEL 01', 'REEL 02'],
    },
    {
      id: 'sub-se-devops',
      label: 'DevOps & SRE',
      group: 'subtopic',
      category: 'Software Engineering',
      depth: 2,
      parentId: 'se',
      score: devopsScore,
      strength: devopsScore / 100,
      reasoning: 'Derived from high retention on Git branching and late-night deployment lifestyle videos.',
      sources: ['REEL 02'],
    },

    // Sub-topics under Programming (Depth 2)
    {
      id: 'sub-prog-python',
      label: 'Python Ecosystem',
      group: 'language',
      category: 'Programming',
      depth: 2,
      parentId: 'prog',
      score: pythonScore,
      strength: pythonScore / 100,
      reasoning: 'High affinity for algorithmic data processing and modern microservices.',
      sources: ['REEL 03', 'REEL 07'],
    },
    {
      id: 'sub-prog-jsts',
      label: 'JavaScript / TypeScript',
      group: 'language',
      category: 'Programming',
      depth: 2,
      parentId: 'prog',
      score: jsTsScore,
      strength: jsTsScore / 100,
      reasoning: 'Fullstack developer ecosystem and modern asynchronous pipelines.',
      sources: ['REEL 02', 'REEL 08'],
    },

    // Sub-topics under DSA (Depth 2)
    {
      id: 'sub-dsa-divide',
      label: 'Divide & Conquer',
      group: 'subtopic',
      category: 'DSA',
      depth: 2,
      parentId: 'dsa',
      score: divConquerScore,
      strength: divConquerScore / 100,
      reasoning: 'Replayed 98% of the binary search visualization with bookmarks.',
      sources: ['REEL 07'],
    },
    {
      id: 'sub-dsa-structs',
      label: 'Trees & Hash Maps',
      group: 'subtopic',
      category: 'DSA',
      depth: 2,
      parentId: 'dsa',
      score: dataStructScore,
      strength: dataStructScore / 100,
      reasoning: 'Saved coding interview tips on time complexity and memory indexing.',
      sources: ['REEL 03'],
    },

    // Sub-topics under Hardware (Depth 2)
    {
      id: 'sub-hw-cache',
      label: 'CPU Caching & Memory',
      group: 'subtopic',
      category: 'Hardware',
      depth: 2,
      parentId: 'hardware',
      score: cpuCacheScore,
      strength: cpuCacheScore / 100,
      reasoning: 'Bridges physical GPU/CPU benchmarks with low-level execution speed.',
      sources: ['REEL 05'],
    },

    // Sub-topics under Cybersecurity (Depth 2)
    {
      id: 'sub-cyber-crypto',
      label: 'Cryptography & TLS',
      group: 'subtopic',
      category: 'Cybersecurity',
      depth: 2,
      parentId: 'cyber',
      score: cryptoTlsScore,
      strength: cryptoTlsScore / 100,
      reasoning: 'Saved cryptographic protocol breakdown with 82% watch time.',
      sources: ['REEL 08'],
    },

    // Sub-topics under AI (Depth 2)
    {
      id: 'sub-ai-vector',
      label: 'Vector Embeddings & RAG',
      group: 'subtopic',
      category: 'AI',
      depth: 2,
      parentId: 'ai',
      score: vectorRagScore,
      strength: vectorRagScore / 100,
      reasoning: 'Filtered hype listicles; promoted real algorithmic vector indexing.',
      sources: ['REEL 06 (Filtered) + REEL 07'],
    },
  ];

  const graphLinks: InterestGraphLink[] = [
    // Primary Root Connections
    { source: 'user', target: 'se', strength: 5, type: 'latent', label: `Latent Synthesis (${seScore}%)` },
    { source: 'user', target: 'prog', strength: 4, type: 'direct', label: `Direct Behavior (${progScore}%)` },
    { source: 'user', target: 'dsa', strength: 4, type: 'direct', label: `Problem Solving (${dsaScore}%)` },
    { source: 'user', target: 'hardware', strength: 3, type: 'direct', label: `Hardware (${hwScore}%)` },
    { source: 'user', target: 'cyber', strength: 3, type: 'direct', label: `Security (${cyberScore}%)` },
    { source: 'user', target: 'ai', strength: 2, type: 'latent', label: `Filtered AI (${aiScore}%)` },

    // Hierarchical Parent-Child Links (Depth 1 -> Depth 2)
    { source: 'se', target: 'sub-se-backend', strength: 4.5, type: 'parent_child', label: 'Core Sub-Topic' },
    { source: 'se', target: 'sub-se-devops', strength: 4.0, type: 'parent_child', label: 'Core Sub-Topic' },

    { source: 'prog', target: 'sub-prog-python', strength: 4.0, type: 'parent_child', label: 'Language Sub-Domain' },
    { source: 'prog', target: 'sub-prog-jsts', strength: 4.0, type: 'parent_child', label: 'Language Sub-Domain' },
    { source: 'prog', target: 'java', strength: 3.0, type: 'parent_child', label: 'Direct Mention' },

    { source: 'dsa', target: 'sub-dsa-divide', strength: 5.0, type: 'parent_child', label: 'Specialization' },
    { source: 'dsa', target: 'sub-dsa-structs', strength: 4.5, type: 'parent_child', label: 'Specialization' },

    { source: 'hardware', target: 'sub-hw-cache', strength: 4.5, type: 'parent_child', label: 'Micro-Architecture' },

    { source: 'cyber', target: 'sub-cyber-crypto', strength: 4.5, type: 'parent_child', label: 'Protocol Stack' },

    { source: 'ai', target: 'sub-ai-vector', strength: 4.5, type: 'parent_child', label: 'Vector Indexing' },

    // Cross-Hierarchical Latent Bridges (Multi-Domain Reinforcement)
    {
      source: 'sub-se-backend',
      target: 'sub-dsa-structs',
      strength: 4.5,
      type: 'reinforcement',
      label: 'Databases use B-Trees & Hash Indexes',
    },
    {
      source: 'sub-hw-cache',
      target: 'sub-dsa-divide',
      strength: 4.0,
      type: 'reinforcement',
      label: 'Hardware Cache-Friendly Algorithms',
    },
    {
      source: 'sub-se-devops',
      target: 'sub-cyber-crypto',
      strength: 3.5,
      type: 'reinforcement',
      label: 'Zero-Trust Production CI/CD',
    },
    {
      source: 'sub-dsa-structs',
      target: 'sub-ai-vector',
      strength: 4.0,
      type: 'latent',
      label: 'HNSW Graph Search in Vector DBs',
    },
    {
      source: 'sub-se-backend',
      target: 'sub-prog-python',
      strength: 3.5,
      type: 'reinforcement',
      label: 'FastAPI & Async Services',
    },
  ];

  const avgQuality = reels.length > 0 ? Math.round(totalQualityScore / reels.length) : 85;

  const summary: AnalysisSummary = {
    headlineDiscovery: "YOU DON'T JUST LIKE JAVA. YOU LIKE SOFTWARE ENGINEERING.",
    primaryInterest: 'Software Engineering & Scalable Backend Systems',
    directInterestComparison: {
      naiveKeywordConclusion: 'User watched 2 Java memes → Recommend more Java memes & Java syntax trivia.',
      latentAIConclusion:
        'User engages with programming humor, dev career lifestyle, DSA prep, and hardware benchmarks → Recommend real-world Backend Systems, CPU Cache Mechanics & Vector DBs.',
    },
    behavioralStrengthSummary: `Analyzed ${reels.length} Reels across 6 technical domains. High completion (94% avg) on educational content; filtered ${hypeFilteredCount} clickbait reels.`,
    evidenceItems: [
      'High completion (96%+) across engineering & problem-solving reels',
      'Saved developer workflow & coding interview preparation reels',
      'Replayed algorithmic divide-and-conquer breakdown (98% retention)',
      'Discarded superficial AI listicle hype (72% watch, 0 likes/saves)',
      'Cross-topic synthesis: bridges compiler humor into hierarchical Backend & Systems Engineering profile',
    ],
    topInterests: interestScores,
    hypeFilteredCount,
    averageQualityScore: avgQuality,
    topSubtopics: allSubtopics.slice(0, 6),
  };

  return {
    interestScores,
    summary,
    graphNodes,
    graphLinks,
  };
}

/**
 * Selects and ranks candidate recommendations based on current profile, sub-topic weights, quality scores, and user feedback
 */
export function rankRecommendations(
  reels: Reel[],
  feedback?: UserFeedbackState
): RecommendationOutput[] {
  const { interestScores, summary } = analyzeUserInterests(reels, feedback);
  const primaryCategory = interestScores[0]?.category || 'Software Engineering';

  const candidates = [...CANDIDATE_RECOMMENDATIONS];

  // Adjust for feedback & Content Quality
  const adjusted = candidates.map((candidate) => {
    // Quality scoring
    const quality =
      candidate.qualityBreakdown ||
      calculateContentQuality(
        candidate.recommendedTechReel,
        candidate.whyThisRecommendation,
        [candidate.category, candidate.subtopic || ''],
        candidate.hypeRisk
      );

    let score = candidate.valueScore || quality.compositeScore;

    // Content Quality Rigor Boost
    if (quality.compositeScore >= 90) {
      score += 6; // Reward rigorous CS
    } else if (quality.compositeScore < 60) {
      score -= 15; // Penalize low rigor
    }

    // Difficulty adjustment from user feedback
    if (feedback?.difficultyBias === 'Beginner') {
      if (candidate.difficulty === 'Beginner') score += 18;
      if (candidate.difficulty === 'Intermediate') score += 5;
      if (candidate.difficulty === 'Advanced') score -= 18;
    } else if (feedback?.difficultyBias === 'Advanced') {
      if (candidate.difficulty === 'Advanced') score += 18;
      if (candidate.difficulty === 'Intermediate') score += 6;
      if (candidate.difficulty === 'Beginner') score -= 14;
    }

    // Hype filter strictness from user feedback ('Show fewer hype videos')
    if (feedback?.hypeStrictness === 'Strict' || feedback?.hypeStrictness === 'Ultra') {
      if (candidate.hypeRisk === 'High') score -= 50;
      if (candidate.hypeRisk === 'Medium') score -= 25;
      if (candidate.hypeRisk === 'Low') score += 8;
    }

    // Category boosts from feedback ('More like this' / 'Less like this')
    if (feedback?.categoryBoosts?.[candidate.category]) {
      score += feedback.categoryBoosts[candidate.category] * 8;
    }

    // Subtopic boosts from feedback
    if (candidate.subtopic && feedback?.subtopicBoosts?.[candidate.subtopic]) {
      score += feedback.subtopicBoosts[candidate.subtopic] * 10;
    }

    // Check if dismissed
    if (feedback?.dismissedRecommendationIds?.includes(candidate.id)) {
      score -= 60;
    }

    // Check if bookmarked
    if (feedback?.bookmarkedRecommendationIds?.includes(candidate.id)) {
      score += 15;
    }

    return {
      ...candidate,
      qualityBreakdown: quality,
      valueScore: Math.min(99, Math.max(30, Math.round(score))),
    };
  });

  return adjusted.sort((a, b) => b.valueScore - a.valueScore);
}
