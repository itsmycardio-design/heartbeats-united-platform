import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const title = url.searchParams.get('title') || 'Ukweli Media';
    const imageUrl = url.searchParams.get('image') || '';
    const author = url.searchParams.get('author') || 'Ukweli Media';
    const category = url.searchParams.get('category') || '';

    console.log('Generating OG image for:', { title, imageUrl, author, category });

    // Create SVG with text overlay
    const svg = generateOGImageSVG(title, imageUrl, author, category);

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: unknown) {
    console.error('Error generating OG image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateOGImageSVG(title: string, imageUrl: string, author: string, category: string): string {
  // Truncate title if too long
  const maxTitleLength = 80;
  const displayTitle = title.length > maxTitleLength 
    ? title.substring(0, maxTitleLength) + '...' 
    : title;

  // Split title into lines for better display
  const words = displayTitle.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const maxCharsPerLine = 35;

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].substring(0, displayLines[2].length - 3) + '...';
  }

  // Generate title text elements
  const titleTexts = displayLines.map((line, index) => 
    `<text x="60" y="${280 + (index * 55)}" fill="white" font-family="Georgia, serif" font-size="42" font-weight="bold">${escapeXml(line)}</text>`
  ).join('\n    ');

  // Calculate gradient overlay height based on content
  const contentHeight = 200 + (displayLines.length * 55);
  const gradientStart = Math.max(0, 630 - contentHeight - 100);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Gradient overlay for text readability -->
    <linearGradient id="textOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
      <stop offset="40%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:rgba(0,0,0,0.85);stop-opacity:0.85" />
    </linearGradient>
    
    <!-- Pattern for fallback background -->
    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.1)"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="#1a1a2e"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  
  ${imageUrl ? `
  <!-- Featured Image -->
  <image 
    xlink:href="${escapeXml(imageUrl)}" 
    x="0" 
    y="0" 
    width="1200" 
    height="630" 
    preserveAspectRatio="xMidYMid slice"
  />
  ` : ''}
  
  <!-- Gradient Overlay -->
  <rect x="0" y="${gradientStart}" width="1200" height="${630 - gradientStart}" fill="url(#textOverlay)"/>
  
  <!-- Category Badge -->
  ${category ? `
  <rect x="60" y="200" width="${category.length * 12 + 30}" height="36" rx="18" fill="#e63946"/>
  <text x="${75}" y="225" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-transform="uppercase">${escapeXml(category.toUpperCase())}</text>
  ` : ''}
  
  <!-- Title -->
  ${titleTexts}
  
  <!-- Author -->
  <text x="60" y="${300 + (displayLines.length * 55)}" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="20">By ${escapeXml(author)}</text>
  
  <!-- Logo/Brand -->
  <rect x="60" y="540" width="180" height="50" rx="8" fill="rgba(255,255,255,0.15)"/>
  <text x="90" y="573" fill="white" font-family="Georgia, serif" font-size="24" font-weight="bold">Ukweli</text>
  <text x="165" y="573" fill="#e63946" font-family="Georgia, serif" font-size="24" font-weight="bold">Media</text>
  
  <!-- Decorative accent line -->
  <rect x="60" y="250" width="80" height="4" fill="#e63946"/>
</svg>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
