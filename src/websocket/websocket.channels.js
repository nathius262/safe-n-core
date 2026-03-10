const channels = new Map();

export const subscribe = (ws, channel) => {

    if (!channels.has(channel)) {
        channels.set(channel, new Set());
    }

    channels.get(channel).add(ws);
};

export const unsubscribe = (ws, channel) => {

    if (!channels.has(channel)) return;

    channels.get(channel).delete(ws);
};

export const get_channel_clients = (channel) => {
    return channels.get(channel) || new Set();
};