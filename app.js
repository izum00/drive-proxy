const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const fileId = req.query.file_id;
    const filename = req.query.filename || 'downloaded_file';

    if (!fileId) {
        return res.status(400).send('file_idパラメータが必要です');
    }

    const cleanFileId = fileId.split('?')[0];
    const url = `https://drive.google.com/uc?export=download&id=${cleanFileId}`;

    try {
        const response = await axios.get(url, { responseType: 'stream' });
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        response.data.pipe(res);
    } catch (err) {
        res.status(err.response?.status || 500).send('ファイルの取得に失敗しました');
    }
});

// 必須：Vercelではこのようにモジュールとしてエクスポートする
module.exports = app;
