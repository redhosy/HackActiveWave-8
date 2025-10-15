//import dependencies
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// inisialisasi aplikasi
// deklarasi variable
const app = express();

const upload = multer();

const ai = new GoogleGenAI({});

// inisialisasi middleware
// contoh app.use(namaMiddleware())
app.use(cors());
app.use(express.json());

// inisialisasi routing
// synchronous -->() => {}
// asynchronous --> async () => {}
app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;
    // console.log(prompt);
    //guard cross
    if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({
            success: false,
            message: 'Prompt harus string',
            data: null
        })
    }

    //daleman
    try{
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents:[{
                text: prompt,

            }],
            //config ai-nya lebih jauh
            config: {
                systemInstruction: 'harus pakai menggunakan bahasa indonesia'
            }
        });

        res.status(200).json({
            success:true,
            message: 'Berhasil digenerate',
            data: aiResponse.text
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message: 'gagal generate, server error',
            data: null
        })
    }
});

// server diserve
app.listen(3000, ()=>{
    console.log('Server udah jalan bre 🚀')
})
