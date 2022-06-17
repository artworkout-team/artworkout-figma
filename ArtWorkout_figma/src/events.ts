export declare type EventHandler = {
    name: string;
    handler: (...args: any) => void;
};

const eventHandlers = {};
let currentId = 0;
export function on<Handler extends EventHandler>(name: Handler['name'], handler: Handler['handler']) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function () {
        delete eventHandlers[id];
    };
}

export function once<Handler extends EventHandler>(name: Handler['name'], handler: Handler['handler']) {
    let done = false;
    return on(name, function (...args) {
        if (done === true) {
            return;
        }
        done = true;
        handler(...args);
    });
}

export const emit = typeof window === 'undefined'
    ? function<Handler extends EventHandler> (name: Handler['name'], ...args) {
        figma.ui.postMessage([name, ...args]);
    }
    : function<Handler extends EventHandler> (name: Handler['name'], ...args) {
        window.parent.postMessage({
            pluginMessage: [name, ...args]
        }, '*');
    };

function invokeEventHandler(name, args) {
    for (const id in eventHandlers) {
        if (eventHandlers[id].name === name) {
            eventHandlers[id].handler.apply(null, args);
        }
    }
}

if (typeof window === 'undefined') {
    figma.ui.onmessage = function ([name, ...args]) {
        invokeEventHandler(name, args);
    };
}
else {
    window.onmessage = function (event) {
        if (!Array.isArray(event.data.pluginMessage)) {
            return;
        }
        const [name, ...args] = event.data.pluginMessage;
        invokeEventHandler(name, args);
    };
}
