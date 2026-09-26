import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI lazily
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to get YouTube API Key from client header or process.env
const getYoutubeKey = (req: express.Request): string | null => {
  const clientKey = req.headers['x-youtube-api-key'] as string;
  if (clientKey && clientKey.trim() && clientKey !== 'MY_YOUTUBE_API_KEY') {
    return clientKey.trim();
  }
  const envKey = process.env.YOUTUBE_API_KEY;
  if (envKey && envKey.trim() && envKey !== 'MY_YOUTUBE_API_KEY') {
    return envKey.trim();
  }
  return null;
};

// YouTube API Status
app.get('/api/youtube/status', (req, res) => {
  const apiKey = getYoutubeKey(req);
  const isConfigured = !!apiKey;
  const clientHeader = req.headers['x-youtube-api-key'] as string;
  res.json({
    hasKey: isConfigured,
    mode: isConfigured ? 'live_youtube_api' : 'demo_seed_data',
    keySource: clientHeader ? 'client' : (process.env.YOUTUBE_API_KEY ? 'server' : 'none')
  });
});

// YouTube API Proxy: Most Popular Videos
app.get('/api/youtube/popular', async (req, res) => {
  try {
    const apiKey = getYoutubeKey(req);
    if (!apiKey) {
      return res.status(400).json({ error: 'YouTube API Key is not configured. Set it in Settings or process.env.YOUTUBE_API_KEY.', mode: 'demo' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=24&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.error?.message || 'YouTube API request failed' });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('YouTube API Popular Fetch Error:', error);
    return res.status(500).json({ error: 'Failed to fetch popular YouTube videos' });
  }
});

// YouTube API Proxy: Search Videos
app.get('/api/youtube/search', async (req, res) => {
  try {
    const apiKey = getYoutubeKey(req);
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'YouTube API Key is not configured.', mode: 'demo' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=24&q=${encodeURIComponent(query)}&key=${apiKey}`
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.error?.message || 'YouTube API search failed' });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('YouTube API Search Error:', error);
    return res.status(500).json({ error: 'Failed to search YouTube videos' });
  }
});

// YouTube API Proxy: Comments for Video
app.get('/api/youtube/comments', async (req, res) => {
  try {
    const apiKey = getYoutubeKey(req);
    const videoId = req.query.videoId as string;

    if (!videoId) {
      return res.status(400).json({ error: 'videoId parameter is required' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'YouTube API Key is not configured', mode: 'demo' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${apiKey}`
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.error?.message || 'YouTube API comments failed' });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// API Endpoint: Generate Title & Description for Uploaded Video
app.post('/api/ai/describe', async (req, res) => {
  try {
    const { topic, category, tone } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.json({
        title: `${topic} - Complete Guide`,
        description: `Welcome back to the channel! In this video, we explore ${topic} in detail. Don't forget to like, subscribe, and hit the notification bell for more content!`,
        tags: [topic.toLowerCase().replace(/\s+/g, ''), 'youtube', category ? category.toLowerCase() : 'video', 'trending']
      });
    }

    const prompt = `You are an expert YouTube content creator and SEO specialist.
Topic/Concept: ${topic}
Category: ${category || 'General'}
Tone: ${tone || 'engaging & catchy'}

Generate:
1. 3 highly clickable, SEO-friendly YouTube video titles.
2. A well-formatted YouTube video description with timestamps, call to action, and social handles placeholder.
3. 8 relevant hashtags/tags.

Return JSON in this format:
{
  "titles": ["Title 1", "Title 2", "Title 3"],
  "selectedTitle": "Title 1",
  "description": "Full description here",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating description:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
});

// API Endpoint: Video AI Summary & Highlights
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { title, description } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        summary: `This video, "${title}", provides deep insights into the key subject matter. It breaks down complex ideas into actionable takeaways.`,
        keyHighlights: [
          "0:00 - Introduction & Overview",
          "1:45 - Key Concepts Explained",
          "4:20 - Real World Demonstration",
          "7:10 - Final Thoughts & Summary"
        ],
        takeaway: "Essential watching for anyone interested in this topic."
      });
    }

    const prompt = `Analyze this YouTube Video:
Title: ${title}
Description: ${description}

Provide:
1. Concise 2-sentence executive summary of what viewers will learn.
2. 4-5 estimated Key Highlights / Chapters with realistic timestamps.
3. One key takeaway sentence.

Return JSON format:
{
  "summary": "...",
  "keyHighlights": ["0:00 - Introduction", "2:15 - Key Feature", "5:30 - Deep Dive"],
  "takeaway": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// API Endpoint: AI Comment Suggestions
app.post('/api/ai/comments', async (req, res) => {
  try {
    const { title, description } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        suggestions: [
          "This was super insightful! Thanks for breaking it down so clearly 🙌",
          "Loved the explanation at the 2 minute mark! Need a part 2 on this!",
          "Great quality video! Keep up the awesome work 🔥"
        ]
      });
    }

    const prompt = `Given this video titled "${title}", generate 3 creative, authentic YouTube viewer comment suggestions that a viewer might want to post.

Return JSON format:
{
  "suggestions": ["comment 1", "comment 2", "comment 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to generate comment suggestions' });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YouTube Clone server running on http://0.0.0.0:${PORT}`);
  });
}

start();
