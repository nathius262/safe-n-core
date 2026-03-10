const clients = new Set();

export const register_client = (ws) => {
    clients.add(ws);
};

export const remove_client = (ws) => {
    clients.delete(ws);
};

export const get_clients = () => clients;