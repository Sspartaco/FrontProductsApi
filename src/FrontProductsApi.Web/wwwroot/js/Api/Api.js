const api = (() => {
    async function request(url, method, data = null) {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        };
        if (data) opts.body = JSON.stringify(data);
        try {
            const res = await fetch(url, opts);
            return await res.json();
        } catch (e) {
            return { success: false, message: e.message, data: null };
        }
    }

    return {
        get: url => request(url, 'GET'),
        post: (url, data) => request(url, 'POST', data),
        put: (url, data) => request(url, 'PUT', data),
        delete: url => request(url, 'DELETE')
    };
})();
