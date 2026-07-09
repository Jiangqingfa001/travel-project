import express from 'express';
import travelRouter from './routes/travel.js';
import 'dotenv/config'
import cors from 'cors'

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//创建一个心跳接口
app.post('/api/heartbeat', (req, res) => {
    //打印query
    console.log(req.query)
    console.log(req.body)
    res.json({
        message: '服务正常运行',
        timestamp: new Date().toISOString()
    })
})

//创建一个中间件
app.use('/api/travel', travelRouter)

app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        error: `服务器内部错误：${err.message}`
    });
});

app.listen(port, () => {
    console.log(`服务地址:http://localhost:${port}` )
})

