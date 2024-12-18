# Project Documentation

## Overview
This document maintains documentation for all projects in the workspace. Each project will have its own section with relevant details about architecture, setup, and maintenance.

## Projects

### Web Search MCP Server
Location: /Users/alistair/Documents/Cline/MCP/web-search-server

#### Description
A Model Context Protocol server that provides web search functionality using the Brave Search API. The server exposes a unified search tool that supports web, news, and video searches.

#### Features
- Web search for general queries
- News search for current events
- Video search functionality
- Rate limiting (1 request/second)
- Monthly quota management (2000 requests/month)
- Error handling and type safety

#### Usage
The server provides a single tool `brave_web_search` with the following parameters:
```json
{
  "query": "your search query",
  "count": 10,        // optional (1-20, default: 10)
  "offset": 0,        // optional (0-9, default: 0)
  "type": "web"       // optional ("web", "news", "videos", default: "web")
}
```

#### API Limitations (Free Plan)
- Rate limit: 1 request per second
- Monthly quota: 2000 requests per month
- Available search types:
  * Web search
  * News search
  * Video search
  * News cluster
  * Videos cluster
  * Images

#### Setup Requirements
- Node.js environment
- Brave Search API key (set as BRAVE_API_KEY environment variable)
- Free plan limitations apply

## Development Standards
- Docker-first approach for project containerization
- Git version control for each project
- Simple and elegant solutions preferred
- Documentation to be updated with each significant change
- Environment variables for sensitive data

## Environment Setup
- Working Directory: /Users/alistair/Documents/cline_projects/MCP_web_search
- Documentation Location: /Users/alistair/Documents/cline_projects/MCP_web_search/cline_docs
- MCP Servers Location: /Users/alistair/Documents/Cline/MCP

## Git Strategy
- Each project maintains its own repository
- Regular commits with meaningful messages
- Documentation updates tracked in version control

## Docker Strategy
- Use docker-compose for multi-container applications
- Maintain clear and documented Dockerfile configurations
- Optimize for development and production environments

Last Updated: 2024-01-09
