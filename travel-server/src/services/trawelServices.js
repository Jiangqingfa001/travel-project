    import {  ChatOpenAI } from '@langchain/openai'
    import { HumanMessage, SystemMessage } from '@langchain/core/messages'
    import 'dotenv/config.js'

    class TravelService {
        constructor() {
            this.llm = null
            this.initLLM()
        }

        initLLM() {
            const provider = process.env.MODEL_PROVIDER

            let apikey, baseURL, model;
            if (provider === 'DEEPSEEK') {
                apikey = process.env.DEEPSEEK_API_KEY
                baseURL = process.env.DEEPSEEK_BASE_URL
                model = process.env.DEEPSEEK_MODEL_URL
            } else {
                apikey = process.env.SILICONFLOW_API_KEY
                baseURL = process.env.SILICONFLOW_BASE_URL
                model = process.env.SILICONFLOW_MODEL_URL
            }

            this.llm = new ChatOpenAI({
            configuration: {
                baseURL: baseURL
            },
            apiKey: apikey,
            model,
            temperature: 0.7,
            streaming: true
       })
    }

    async recommend(city, budget, days) {
        if (budget < 100 || days < 1 || days > 30) {
            throw new Error('预算不能低于100元，天数必须在1天到30天之间')
         }
         //提示词数据
         const message = this.getTravelPrompt(city, budget, days)
         try {
         //调用LLM
         const response =  await this.llm.invoke(message)
         console.log(response)
         //获取大模型返回内容
         const fullResponse = response.content || ''
         try {
         const jsonMatch = fullResponse.match(/```json\s*\n([\s\S]*?)\n\s*```/) ||
                fullResponse.match(/```\s*\n([\s\S]*?)\n\s*```/) ||
                fullResponse.match(/\{[\s\S]*\}/);
                //处理之后的json对象
            let jsonStr;
            if (jsonMatch) {
                jsonStr = jsonMatch[1] || jsonMatch[0];
            } else {
                jsonStr = fullResponse;
            }
            const resData = JSON.parse(jsonStr)
            return resData
         } catch (error) {
            return {
                success: false,
                error: 'JSON解析失败',
                rawResponse: error.message
            }
        }
     } catch (error) {
        return {
            success: false,
            error: error.message
        }
     }
}
    getTravelPrompt(city, budget, days) {
        return [
            new HumanMessage(
                `你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。

                请根据以下信息为用户生成一份详细的旅游规划：
                - 目的地城市：${city}
                - 预算：${budget}元
                - 旅行天数：${days}天

                要求：
                1. 每天的行程安排（上午、下午、晚上）
                2. 每个景点的详细介绍
                3. 交通建议
                4. 预算分配明细
                5. 注意事项
                6. 所有费用金额统一使用人民币（元）作为单位，不要使用其他货币单位

                请以JSON格式输出，结构如下：
                {
                "success": true,
                "city": "城市名",
                "days": 天数,
                "totalBudget": 总预算,
                "dailyItinerary": [
                    {
                    "day": 1,
                    "date": "第1天",
                    "morning": {
                        "spot": "景点名称",
                        "duration": "游览时长",
                        "ticket": "门票价格",
                        "transportation": "交通方式",
                        "description": "景点介绍"
                    },
                    "afternoon": {
                        "spot": "景点名称",
                        "duration": "游览时长",
                        "ticket": "门票价格",
                        "transportation": "交通方式",
                        "description": "景点介绍"
                    },
                    "evening": {
                        "spot": "活动名称",
                        "duration": "活动时长",
                        "ticket": "费用",
                        "transportation": "交通方式",
                        "description": "活动介绍"
                    }
                    }
                ],
                "budgetBreakdown": {
                    "accommodation": "住宿费用(元)",
                    "food": "餐饮费用(元)",
                    "transportation": "交通费用(元)",
                    "tickets": "门票费用(元)",
                    "other": "其他费用(元)"
                },
                "tips": ["提示1", "提示2", "提示3"],
                "warnings": ["注意事项1", "注意事项2"]
                }

                请确保JSON格式正确，可以被解析。`
)
           ]
        }

        //流式对话
        async chat (message, streamCallback) {
            //组装参数
            const messages = [
                 new SystemMessage(`你是一个专业的旅游规划师，请用中文回答用户的问题。

【回复格式要求】请使用 Markdown 格式组织你的回答，具体要求如下：
1. 使用 ## 或 ### 标题分段，每个话题一个标题
2. 使用有序列表（1. 2. 3.）或无序列表（- ）列出要点
3. 重要信息使用 **加粗** 突出显示
4. 推荐景点时使用以下格式：
   - 景点名称：简短介绍（门票价格、开放时间、游玩时长）
5. 行程建议按天分段，每天用 ### 标题
6. 预算相关金额统一使用人民币（元）作为单位
7. 回答简洁有条理，避免大段文字堆砌`),
                 new HumanMessage(message)
            ]
            try {
                //调用大模型获取流式响应
                const stream = await this.llm.stream(messages)
                let fullResponse = ''

                for await (const chunk of stream) {
                    const content = chunk.content || ''
                    //如果返回的内容为空，请跳过
                    if (content.trim() === '') {
                        continue
                    }
                    //发送内容到客户端
                    fullResponse += content

                    if (streamCallback) {
                        streamCallback(content)
                    }
                }
                return {
                    success: true,
                    reply: fullResponse
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                }
            }
        }
    }
export default new TravelService()