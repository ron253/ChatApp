import threading
from database import socketio, app, manager


if __name__ == '__main__':
    # from gevent import monkey
    # from gevent.pywsgi import WSGIServer
    # http_server = WSGIServer('0.0.0.0', 5000, app)
    # http_server.serve_forever()
    # manager.run()
    socketio.run(app)
    manager.run()