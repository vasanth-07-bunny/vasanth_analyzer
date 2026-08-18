import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/gemini/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const reels = parsed.reels || [];

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ fallback: true, message: 'No API key configured, using engine' }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const prompt = `You are the recommendation agent for "THE ALGORITHM KNOWS YOU TOO WELL".
Analyze this student's short-form Reel scrolling history:
${JSON.stringify(reels, null, 2)}

Crucial Task:
1. Do NOT perform naive keyword matching (e.g., "User watched 2 Java memes -> recommend Java").
2. Discover the DEEP LATENT interest. A student watching Java memes, coding interview tips, first-week dev lifestyle, and RTX laptop benchmarks actually likes SOFTWARE ENGINEERING & COMPUTER SYSTEMS.
3. Distinguish useful non-hype content from superficial listicles (e.g. "10 AI tools that get you a job").
4. Provide structured analysis output.`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      headlineDiscovery: {
                        type: Type.STRING,
                        description: 'Bold reveal string, e.g. YOU DO NOT JUST LIKE JAVA. YOU LIKE SOFTWARE ENGINEERING.',
                      },
                      primaryInterest: {
                        type: Type.STRING,
                        description: 'The inferred underlying interest domain.',
                      },
                      naiveKeywordConclusion: {
                        type: Type.STRING,
                        description: 'What a weak algorithm would have concluded.',
                      },
                      latentAIConclusion: {
                        type: Type.STRING,
                        description: 'What our intelligent agent actually inferred.',
                      },
                      recommendedTechReel: {
                        type: Type.STRING,
                        description: 'Title of recommended high-value technical Reel.',
                      },
                      category: {
                        type: Type.STRING,
                        description: 'Category like DSA, System Design, Architecture, AI, Cybersecurity.',
                      },
                      whyThisRecommendation: {
                        type: Type.STRING,
                        description: 'Deep semantic reason explaining why this Reel is suggested.',
                      },
                      difficulty: {
                        type: Type.STRING,
                        description: 'Beginner, Intermediate, or Advanced',
                      },
                      confidence: {
                        type: Type.STRING,
                        description: 'High, Medium, or Low',
                      },
                      interestMatch: { type: Type.INTEGER },
                      techRelevance: { type: Type.INTEGER },
                      hypeRisk: { type: Type.STRING },
                      valueScore: { type: Type.INTEGER },
                      evidenceChecklist: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: [
                      'headlineDiscovery',
                      'primaryInterest',
                      'naiveKeywordConclusion',
                      'latentAIConclusion',
                      'recommendedTechReel',
                      'category',
                      'whyThisRecommendation',
                      'difficulty',
                      'confidence',
                      'interestMatch',
                      'techRelevance',
                      'evidenceChecklist',
                    ],
                  },
                },
              });

              const resultText = response.text || '{}';
              const aiData = JSON.parse(resultText);

              const responsePayload = {
                summary: {
                  headlineDiscovery: aiData.headlineDiscovery || "YOU DON'T JUST LIKE JAVA. YOU LIKE SOFTWARE ENGINEERING.",
                  primaryInterest: aiData.primaryInterest || 'Software Engineering & Production Systems',
                  directInterestComparison: {
                    naiveKeywordConclusion: aiData.naiveKeywordConclusion || 'User watched Java memes → Recommend more Java memes.',
                    latentAIConclusion: aiData.latentAIConclusion || 'User engages with programming humor, dev career lifestyle, and algorithms → Recommend Backend Engineering & Systems.',
                  },
                  behavioralStrengthSummary: `AI analyzed ${reels.length} Reels with multi-signal behavioral weighting.`,
                  evidenceItems: aiData.evidenceChecklist || [
                    'High completion on developer culture & compiler memes',
                    'Saved coding interview preparation reel',
                    'Discarded superficial AI listicle hype',
                  ],
                  topInterests: [],
                  hypeFilteredCount: 1,
                },
                recommendation: {
                  id: 'gemini-rec-1',
                  currentReelRef: 'Live behavioral synthesis across all recent Reel scrolls',
                  interestDetected: aiData.primaryInterest,
                  whyInterestDetected: aiData.latentAIConclusion,
                  recommendedTechReel: aiData.recommendedTechReel,
                  category: aiData.category || 'DSA',
                  whyThisRecommendation: aiData.whyThisRecommendation,
                  difficulty: aiData.difficulty || 'Intermediate',
                  confidence: aiData.confidence || 'High',
                  valueScore: aiData.valueScore || 95,
                  interestMatch: aiData.interestMatch || 92,
                  hypeRisk: aiData.hypeRisk || 'Low',
                  techRelevance: aiData.techRelevance || 96,
                  evidenceChecklist: aiData.evidenceChecklist || [],
                  channelName: '@deep_tech_digest',
                  durationString: '0:55',
                  keyLearningTakeaways: [
                    'Production-grade implementation trade-offs',
                    'Connecting algorithmic theory with developer workflows',
                  ],
                },
                rawInsightText: aiData.whyThisRecommendation,
              };

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(responsePayload));
            } catch (err: any) {
              console.error('Server Gemini Error:', err);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true, error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
