// Polyfills for web APIs in Jest environment

// Mock Request API (for Next.js Request)
global.Request = class Request {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers);
    this.body = init.body;
  }

  async json() {
    return JSON.parse(this.body || '{}');
  }

  async text() {
    return this.body || '';
  }
};

// Mock Response API
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Headers(init.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }

  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
  }

  // Add static method for NextResponse compatibility
  static json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  }
};

// Mock Headers API
global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers.set(key.toLowerCase(), value);
      });
    }
  }

  get(name) {
    return this._headers.get(name.toLowerCase()) || null;
  }

  set(name, value) {
    this._headers.set(name.toLowerCase(), value);
  }

  has(name) {
    return this._headers.has(name.toLowerCase());
  }

  delete(name) {
    return this._headers.delete(name.toLowerCase());
  }

  forEach(callback) {
    this._headers.forEach((value, key) => callback(value, key));
  }
};

// Mock TransformStream for Playwright
global.TransformStream = class TransformStream {
  constructor() {
    this.readable = {
      getReader: () => ({
        read: () => Promise.resolve({ done: true, value: undefined }),
        releaseLock: () => {},
      }),
    };
    this.writable = {
      getWriter: () => ({
        write: () => Promise.resolve(),
        close: () => Promise.resolve(),
        abort: () => Promise.resolve(),
      }),
    };
  }
};

// Mock ReadableStream
global.ReadableStream = class ReadableStream {
  constructor() {
    this.getReader = () => ({
      read: () => Promise.resolve({ done: true, value: undefined }),
      releaseLock: () => {},
    });
  }
};

// Mock WritableStream
global.WritableStream = class WritableStream {
  constructor() {
    this.getWriter = () => ({
      write: () => Promise.resolve(),
      close: () => Promise.resolve(),
      abort: () => Promise.resolve(),
    });
  }
};

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock URL API
global.URL = class URL {
  constructor(url) {
    this.href = url;
    this.pathname = url.split('?')[0];
    this.search = url.includes('?') ? `?${url.split('?')[1]}` : '';
    this.searchParams = new URLSearchParams(this.search);
  }

  toString() {
    return this.href;
  }
};

// Mock URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor(search = '') {
    this._params = new Map();
    if (search.startsWith('?')) {
      search = search.slice(1);
    }
    if (search) {
      search.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
          this._params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
        }
      });
    }
  }

  get(name) {
    return this._params.get(name) || null;
  }

  set(name, value) {
    this._params.set(name, value);
  }

  toString() {
    const pairs = [];
    this._params.forEach((value, key) => {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    return pairs.join('&');
  }
};

// Mock NextRequest for Next.js API routes
global.NextRequest = class NextRequest extends Request {
  constructor(input, init = {}) {
    super(input, init);
    this.nextUrl = new URL(typeof input === 'string' ? input : input.url);
    this.cookies = {
      get: (name) => {
        const cookieHeader = this.headers.get('cookie');
        if (!cookieHeader) return undefined;
        const cookies = cookieHeader.split(';').map(c => c.trim());
        const cookie = cookies.find(c => c.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : undefined;
      },
      getAll: () => [],
      set: () => {},
      delete: () => {},
    };
    this.page = {};
    this.ua = {};
  }
};
