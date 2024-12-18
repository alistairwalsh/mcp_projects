#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
const WEB_SEARCH_TOOL = {
    name: "brave_web_search",
    description: "Performs a web search using the Brave Search API, ideal for general queries, news, articles, and online content. " +
        "Use this for broad information gathering, recent events, or when you need diverse web sources. " +
        "Supports pagination, content filtering, and freshness controls. " +
        "Maximum 20 results per request, with offset for pagination. ",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Search query (max 400 chars, 50 words)"
            },
            count: {
                type: "number",
                description: "Number of results (1-20, default 10)",
                default: 10
            },
            offset: {
                type: "number",
                description: "Pagination offset (max 9, default 0)",
                default: 0
            },
            type: {
                type: "string",
                description: "Type of search results (web, news, videos)",
                enum: ["web", "news", "videos"],
                default: "web"
            }
        },
        required: ["query"],
    },
};
// Server implementation
const server = new Server({
    name: "web-search-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Check for API key
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_API_KEY) {
    console.error("Error: BRAVE_API_KEY environment variable is required");
    process.exit(1);
}
const RATE_LIMIT = {
    perSecond: 1,
    perMonth: 2000
};
let requestCount = {
    second: 0,
    month: 0,
    lastReset: Date.now()
};
// Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function checkRateLimit() {
    const now = Date.now();
    if (now - requestCount.lastReset > 1000) {
        requestCount.second = 0;
        requestCount.lastReset = now;
    }
    if (requestCount.second >= RATE_LIMIT.perSecond ||
        requestCount.month >= RATE_LIMIT.perMonth) {
        // Wait for 1.1 seconds to ensure we're past the rate limit window
        await sleep(1100);
        requestCount.second = 0;
        requestCount.lastReset = Date.now();
    }
    requestCount.second++;
    requestCount.month++;
}
async function performSearch(query, count = 10, offset = 0, type = "web") {
    await checkRateLimit();
    // Determine the endpoint based on type
    const endpoint = type === "web" ? "web/search" : type === "news" ? "news/search" : "videos/search";
    const url = new URL(`https://api.search.brave.com/res/v1/${endpoint}`);
    url.searchParams.set('q', query);
    url.searchParams.set('count', Math.min(count, 20).toString()); // API limit
    url.searchParams.set('offset', offset.toString());
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });
    if (!response.ok) {
        throw new Error(`Brave API error: ${response.status} ${response.statusText}\n${await response.text()}`);
    }
    const data = await response.json();
    console.error('API Response:', JSON.stringify(data, null, 2)); // Debug log
    // Extract results based on type
    let results = [];
    switch (type) {
        case "news":
            results = (data.results || []).map((result) => ({
                title: result.title || '',
                description: result.description || '',
                url: result.url || ''
            }));
            break;
        case "videos":
            results = (data.results || []).map((result) => ({
                title: result.title || '',
                description: result.description || '',
                url: result.url || ''
            }));
            break;
        case "web":
        default:
            results = (data.web?.results || []).map((result) => ({
                title: result.title || '',
                description: result.description || '',
                url: result.url || ''
            }));
    }
    if (results.length === 0) {
        return "No results found.";
    }
    return results.map((r) => `Title: ${r.title}\nDescription: ${r.description}\nURL: ${r.url}`).join('\n\n');
}
// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [WEB_SEARCH_TOOL],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        if (!args) {
            throw new Error("No arguments provided");
        }
        if (name === "brave_web_search") {
            const { query, count = 10, offset = 0, type = "web" } = args;
            const results = await performSearch(query, count, offset, type);
            return {
                content: [{ type: "text", text: results }],
                isError: false,
            };
        }
        return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Brave Search MCP Server running on stdio");
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
