import {Server} from "ws"
import {log} from "./console"
import {pairs} from "../common"

function logError(error) {
  if (error) {
    log(error)
  }
}

export function startServer({port}) {
  const wss = new Server({port})

  log("Reload server up and listening in port " + port + "...")

  const server = {
    notifyPing() {
      wss.clients.forEach(client => {
        client.send(JSON.stringify({
          type: "ping"
        }), logError)
      })
    },
    notifyModule(module) {
      if (wss.clients.length) {
        log("Notify clients about a module change...")
      }
      wss.clients.forEach(client => {
        client.send(JSON.stringify({
          type: "module",
          data: module
        }), logError)
      })
    },
    notifyReload(metadata) {
      if (wss.clients.length) {
        log("Notify clients about bundle change...")
      }
      wss.clients.forEach(client => {
        client.send(JSON.stringify({
          type: "change",
          data: metadata
        }), logError)
      })
    },
    notifyBundleError(error) {
      if (wss.clients.length) {
        log("Notify clients about bundle error...")
      }
      wss.clients.forEach(client => {
        client.send(JSON.stringify({
          type: "bundle_error",
          data: { error: error.toString() }
        }), logError)
      })
    }
  }

  wss.on("connection", client => {
    log("New client connected")
  })

  server._pingInterval = setInterval(server.notifyPing.bind(this), 10 * 1000);
  
  return server
}
