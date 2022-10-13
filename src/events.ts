export declare type EventHandler = {
  name: string
  handler: (...args: any) => void
}

const eventHandlers = {}
let currentId = 0
export function on<Handler extends EventHandler>(
  name: Handler['name'],
  handler: Handler['handler']
) {
  const id = `${currentId}`
  currentId += 1
  eventHandlers[id] = { handler, name }
  return function () {
    delete eventHandlers[id]
  }
}

export function once<Handler extends EventHandler>(
  name: Handler['name'],
  handler: Handler['handler']
) {
  let done = false
  return on(name, function (...args) {
    if (done === true) {
      return
    }
    done = true
    handler(...args)
  })
}

export const emit =
  typeof window === 'undefined'
    ? function <Handler extends EventHandler>(name: Handler['name'], ...args) {
        figma.ui.postMessage([name, ...args])
      }
    : function <Handler extends EventHandler>(name: Handler['name'], ...args) {
        window.parent.postMessage(
          {
            pluginMessage: [name, ...args],
          },
          '*'
        )
      }

function invokeEventHandler(name, args) {
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args)
    }
  }
}

if (typeof window === 'undefined') {
  figma.ui.onmessage = function (...params) {
    if (params[0]?.jsonrpc) {
      return
    }
    const [name, ...args] = params[0]
    invokeEventHandler(name, args)
  }
} else {
  setTimeout(() => {
    // TODO: very dirty hack, needs fixing
    const fallback = window.onmessage
    window.onmessage = function (...params) {
      fallback.apply(window, params)
      const event = params[0]
      if (!Array.isArray(event.data.pluginMessage)) {
        return
      }
      const [name, ...args] = event.data.pluginMessage
      invokeEventHandler(name, args)
    }
  }, 100)
}
