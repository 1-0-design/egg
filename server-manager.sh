#!/bin/bash

SERVER_PID_FILE=".server.pid"

start_server() {
  if [ -f "$SERVER_PID_FILE" ]; then
    echo "Server appears to be running already. Use stop first if you need to restart."
    return 1
  fi
  
  echo "Starting Node.js server in background..."
  node server.js > server.log 2>&1 &
  PID=$!
  echo $PID > $SERVER_PID_FILE
  echo "Server started with PID: $PID"
  echo "Use './server-manager.sh status' to check status"
  echo "Use './server-manager.sh log' to see server output"
}

stop_server() {
  if [ ! -f "$SERVER_PID_FILE" ]; then
    echo "No server PID file found. Server might not be running."
    return 1
  fi
  
  PID=$(cat $SERVER_PID_FILE)
  echo "Stopping Node.js server with PID: $PID..."
  
  if kill $PID 2>/dev/null; then
    echo "Server stopped successfully."
    rm $SERVER_PID_FILE
  else
    echo "Could not stop server. It may have already exited."
    echo "Removing PID file anyway."
    rm $SERVER_PID_FILE
  fi
}

status_server() {
  if [ ! -f "$SERVER_PID_FILE" ]; then
    echo "No server PID file found. Server is not running."
    return 1
  fi
  
  PID=$(cat $SERVER_PID_FILE)
  if ps -p $PID > /dev/null; then
    echo "Server is running with PID: $PID"
    echo "Port: $(lsof -Pan -p $PID -i tcp | grep LISTEN | awk '{print $9}' | sed 's/.*://')"
  else
    echo "Server PID file exists but process is not running."
    echo "Cleaning up stale PID file."
    rm $SERVER_PID_FILE
  fi
}

log_server() {
  if [ -f "server.log" ]; then
    echo "=== Server Log ==="
    tail -20 server.log
    echo "==================="
    echo "Use 'tail -f server.log' for continuous monitoring"
  else
    echo "No server log file found."
  fi
}

case "$1" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    sleep 1
    start_server
    ;;
  status)
    status_server
    ;;
  log)
    log_server
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|log}"
    exit 1
    ;;
esac

exit 0
