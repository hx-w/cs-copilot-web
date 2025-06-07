import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText, tool } from 'ai';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import pool from '../../../lib/db';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const mdPath = path.join(process.cwd(), 'docs', 'DB_QUERIES.md');
  const mdContent = fs.readFileSync(mdPath, 'utf-8');

  const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    system: `你是一个专业的CS2游戏数据分析机器人。` +
      `你的核心任务是根据用户的提问，通过调用工具来查询数据库并回答问题。` +
      `规则：` +
      `1. 分析用户的请求，理解其查询意图。` +
      `2. **必须**使用 \`queryDatabase\` 工具来执行SQL查询以获取数据。这是你获取数据的唯一途径。` +
      `3. **严禁**将SQL查询语句作为文本直接回复给用户。` +
      `4. **严禁**编造任何不通过工具查询获得的数据。` +
      `5. 在获得工具返回的JSON结果后，你必须对结果进行清晰、友好的总结，并以自然语言的形式回复给用户。在这一步，不要再调用任何工具。` +
      `6. 你的SQL知识基于以下数据库文档，请严格遵守：\n${mdContent}`,
    messages,
    maxSteps: 5,
    toolChoice: 'auto',
    tools: {
      queryDatabase: tool({
        description: '用这个工具执行SQL查询以回答用户的问题。',
        parameters: z.object({
          sqlQuery: z.string().describe('要执行的SQL查询语句。'),
        }),
        execute: async ({ sqlQuery }, { toolCallId }) => {
          try {
            console.log(`Executing SQL query: ${sqlQuery}`);
            const dbResponse = await pool.query(sqlQuery);
            // 将查询结果转换为更适合AI处理的格式
            const resultData = {
              rowCount: dbResponse.rowCount,
              columns: dbResponse.fields.map(field => field.name),
              rows: dbResponse.rows,
            };
            console.log('Query result:', resultData);
            return JSON.stringify(resultData);
          } catch (error: any) {
            console.error('Database query failed:', error);
            return JSON.stringify({ error: '查询执行失败', details: error.message });
          }
        },
      }),
    },
    onStepFinish: async (step) => {
      // 一个步骤可能包含多个工具调用。我们遍历结果
      // 并将它们添加到消息数组中。
      if (step.toolResults) {
        for (const toolResult of step.toolResults) {
          messages.push({
            role: 'tool',
            toolCallId: toolResult.toolCallId,
            toolName: toolResult.toolName,
            content: JSON.stringify(toolResult.result),
          });
        }
      }
    }
  });

  return result.toDataStreamResponse();
}
