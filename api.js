// api.js

const makeRequest = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
};

const GET = (url) => {
    return makeRequest(url, { method: 'GET' });
};

const POST = (url, data) => {
    return makeRequest(url, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
};

const PUT = (url, data) => {
    return makeRequest(url, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
};

const DELETE = (url) => {
    return makeRequest(url, { method: 'DELETE' });
};

export { makeRequest, GET, POST, PUT, DELETE };