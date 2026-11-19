import { ChatOpenAI } from '@langchain/openai';
import { config, type ModelConfig } from '../config.ts';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { getMCPTools } from './mcpService.ts';
import { z } from 'zod/v3';

export class OpenRouterService {
    private config: ModelConfig;
    private llmClient: ChatOpenAI;
    private tools: any[];

    constructor(configOverride?: ModelConfig) {
        this.config = configOverride ?? config;
        this.llmClient = this.#createChatModel(this.config.models[0]);
        this.tools = [];
    }

    #createChatModel(modelName: string): ChatOpenAI {
        return new ChatOpenAI({
            apiKey: this.config.apiKey,
            modelName: modelName,
            temperature: this.config.temperature,
            maxTokens: this.config.maxTokens,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': this.config.httpReferer,
                    'X-Title': this.config.xTitle,
                },
            },
            modelKwargs: {
                models: this.config.models,
                provider: this.config.provider,
            },
        });
    }

    async #getTools() {
        if (!this.tools.length) {
            this.tools = await getMCPTools();
        }
        return this.tools;
    }

    async generateStructured<T extends Record<string, any> = Record<string, any>>(
        systemPrompt: string,
        userPrompt: string,
        schema?: z.ZodSchema<T>,
    ): Promise<{ data?: T | string; }> {
        const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage(userPrompt),
        ];

        if (schema) {
            const structuredModel = this.llmClient.withStructuredOutput(schema);
            const data = await structuredModel.invoke(messages);
            return { data };
        }

        const tools = await this.#getTools();
        const agent = createReactAgent({
            llm: this.llmClient,
            tools,
            prompt: systemPrompt,
        });
        const response = await agent.invoke({ messages: [new HumanMessage(userPrompt)] });
        const content = response.messages.at(-1)?.content;

        return {
            data: typeof content === 'string' ? content : JSON.stringify(content ?? ''),
        };
    }
}
