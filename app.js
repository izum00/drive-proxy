const express = require('express');
const cors = require('cors');
const axios = require('axios');
const stream = require('stream');

const app = express();
const PORT = 7860;

app.use(cors()); // すべてのドメインを許可

app.get('/', async (req, res) => {
    const fileId = req.query.file_id;
    const filename = req.query.filename || 'downloaded_file';

    if (!fileId) {
        return res.status(400).send('file_idパラメータが必要です');
    }

    // 不要なクエリを除去
    const cleanFileId = fileId.split('?')[0];
    const url = `https://drive.google.com/uc?export=download&id=${cleanFileId}`;

    try {
        const response = await axios.get(url, {
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        response.data.pipe(res); // ストリームとして送信
    } catch (err) {
        res.status(err.response?.status || 500).send('ファイルの取得に失敗しました');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
