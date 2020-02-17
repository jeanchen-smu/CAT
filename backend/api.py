from api.endpoints import app
import sys
from gevent.pywsgi import WSGIServer


reload(sys)
sys.setdefaultencoding('utf-8')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8009)
    # http_server = WSGIServer(('',8009), app)
    # http_server.serve_forever()
