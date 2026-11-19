import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getMongoDBTool } from "../tools/mongodbTool.ts";
import { getCSVTOJSONTool } from "../tools/csvToJSONTool.ts";
import { getFSTool } from "../tools/fsTool.ts";

export const getMCPTools = async () => {
  const client = new MultiServerMCPClient({
    mcpServers: {
      ...getMongoDBTool(),
      ...getFSTool(),
    },
    onMessage: (_log: unknown, source: any) => {
      console.log(`[${(source as any)?.server}] ${(source as any)?.data}`)
    }
  })

  const mcpTools = await client.getTools()

  return [
    ...mcpTools,
    getCSVTOJSONTool()
  ];
};
