import express from 'express'
import travelService from '../services/trawelServices.js'
import { createStreamResponse } from '../utils/steamUtiles.js'

const router = express.Router()


//推荐景点接口
router.post('/recommend', async (req, res) => {
const {city, budget, days} = req.body
if (!city || !budget || !days) {
    return res.status(400).json({
        success: false,
        error: '缺少必要参数：city,budget,days'
    })
}
    const result = await travelService.recommend(city, budget, days)
    return res.json(result)
   // return res.json({
     //   message: '推荐景点',
      //  timestamp: new Date().toISOString()
  //  })
})

router.post('/chat', async (req, res) => {
    const {message} = req.body
    if (!message) {
        return res.status(400).json({
            success: false,
            error: '缺少必要参数：message'
        })
    }
    //对SSE流式接口处理
    const stream = createStreamResponse(res)

    try {
        //调用大模型获取流式响应
        const result = await travelService.chat(message, (chunk) => {
            stream.send({ type: 'chunk', content: chunk })
        })
        stream.end({ type: 'complete', data: result })
    } catch (error) {
        stream.error(error.message)
    }
    // return res.json({
    //     message: '聊天',
    //     timestamp: new Date().toISOString()
    // })
})

export default router;