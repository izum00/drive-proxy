from flask import Flask, request, send_file, abort
from flask_cors import CORS  # ← 追加
import requests
import io

app = Flask(__name__)
CORS(app)  # ← これで全てのドメインからのアクセスを許可

@app.route('/', methods=['GET'])
def download_file():
    # クエリパラメータからファイルIDを受け取る
    file_id = request.args.get('file_id')
    filename = request.args.get('filename', 'downloaded_file')

    if not file_id:
        return abort(400, description="file_idパラメータが必要です")

    # 不要なクエリ（?以降）があれば除去
    file_id = file_id.split('?')[0]

    # Google DriveのダウンロードURL
    url = f"https://drive.google.com/uc?export=download&id={file_id}"

    response = requests.get(url)
    
    if response.status_code == 200:
        # レスポンス内容をメモリ上のファイルにする
        file_stream = io.BytesIO(response.content)
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=filename
        )
    else:
        return abort(response.status_code, description="ファイルの取得に失敗しました")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860, debug=True)
