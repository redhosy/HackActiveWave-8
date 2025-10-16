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

const GEMINI_API_KEY = "gemini-2.5-flash";

// inisialisasi middleware
// contoh app.use(namaMiddleware())
app.use(cors());
app.use(express.json());

// inisialisasi routing
// synchronous -->() => {}
// asynchronous --> async () => {}

// endpoint text
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
    try {
        const aiResponse = await ai.models.generateContent({
            model: GEMINI_API_KEY,
            contents: [{
                text: prompt,

            }],
            //config ai-nya lebih jauh
            config: {
                systemInstruction: 'harus pakai menggunakan bahasa indonesia'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil digenerate',
            data: aiResponse.text
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'gagal generate, server error',
            data: null
        })
    }
});

// endpoint image
app.post('/generate-image', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_API_KEY,
            contents: [{
                text: prompt
            },
            { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
            ],
            config: {
                systemInstruction: 'buat deskripsi gambar yang menarik dalam bahasa indonesia'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil generate image',
            data: response.text
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'gagal generate image, server error',
            data: null
        })
    }
});

// endpoint dokumen
app.post('/generate-document', upload.single('document'), async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_API_KEY,
            contents: [{
                text: prompt ?? "buatkan ringkasan dari file berikut", type: 'text'
            },
            { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
            ],
            config: {
                systemInstruction: "buat ringkasan dari file berikut dalam bahasa indonesia"
            }
        });
        res.status(200).json({
            success: true,
            message: 'Berhasil generate document',
            data: response.text
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'gagal generate document, server error',
            data: null
        });
    }
});

// endpoint audio
app.post('/generate-audio', upload.single('audio'), async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_API_KEY,
            contents: [
                { text: prompt ?? "buatkan transkip dari file audio tersebut", type: 'text' },
                { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
            ],
            config: {
                systemInstruction: "buatkan transkip dari file audio berikut dalam bahasa indonesia"
            }
        });
        res.status(200).json({
            Success: true,
            message: "berhasil generate audio",
            data: response.text
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'gagal generate audio, server error',
            data: null
        });
    }
})

// server diserve
app.listen(3000, () => {
    console.log('Server udah jalan bre 🚀')
})
