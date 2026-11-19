# Multiple MCP Tools Agent

LangGraph agent with multiple MCP (Model Context Protocol) tools for interacting with MongoDB, CSV files, and the local filesystem.

## Overview

This project implements a conversational AI agent using LangChain and LangGraph that can:

- Query MongoDB databases through MCP tools
- Read and parse CSV files to answer questions
- Access and read files from the local filesystem
- Chain prompts for intelligent question routing

## Architecture

The application uses a state graph pipeline with two main nodes:

1. **Intent Parser**: Analyzes user questions and routes them appropriately
2. **Agent Node**: Processes the routed intent using available MCP tools

## Setup

### Prerequisites

- Node.js >= 24.10.0
- Docker (for infrastructure)

### Installation

```bash
npm install
```

### Infrastructure

Start the MongoDB infrastructure:

```bash
npm run docker:infra:up
```

Or use Docker Compose directly:

```bash
docker compose up -d --wait
```

### Running the Application

Development mode with watch and inspect:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will be available at `http://0.0.0.0:3000`

## API

### POST /chat

Submit a question to the agent:

```json
POST /chat
{
  "question": "What products are in the sales data?"
}
```

## Docker Commands

- `npm run docker:infra:up` - Start infrastructure
- `npm run docker:infra:down` - Stop infrastructure  
- `npm run docker:infra:cleanup` - Clean up volumes and storage
- `npm run docker:infra:logs` - View logs

## Technologies

- **LangChain**: For LLM orchestration and tool use
- **LangGraph**: For building stateful multi-agent workflows
- **Fastify**: Lightweight Node.js web framework
- **MCP Adapters**: Model Context Protocol integration
- **MongoDB**: Document database for data storage
- **OpenRouter**: AI model provider

## Project Structure

```
src/
├── config.ts          # Configuration settings
├── index.ts           # Application entry point
├── server.ts          # Fastify server setup
└── graph/
    ├── factory.ts     # Graph builder
    ├── graph.ts       # Compiled state graph
    └── state.ts       # Graph state definition
├── prompts/           # Prompt templates
├── nodes/             # Graph node implementations
│   ├── intentNode.ts
│   └── agentNode.ts
└── services/          # External service clients
    ├── mcpService.ts
    └── openRouterService.ts

tools/                 # MCP tool definitions
├── mongodbTool.ts
├── csvToJSONTool.ts
└── fsTool.ts
```

## License

MIT
