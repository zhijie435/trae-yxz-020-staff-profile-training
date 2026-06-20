const BASE_URL = '';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

function handleAuthError(router) {
  localStorage.removeItem('token');
  localStorage.removeItem('employeeInfo');
  router.push('/login');
}

async function request(url, options = {}, router) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (res.status === 401) {
      handleAuthError(router);
      return null;
    }

    const text = await res.text();
    if (!text) {
      return { code: -1, message: '服务器返回空响应' };
    }

    try {
      const result = JSON.parse(text);
      return result;
    } catch (parseError) {
      console.error('JSON parse failed:', parseError, 'Response:', text);
      return { code: -1, message: '服务器响应格式错误' };
    }
  } catch (e) {
    console.error('API request failed:', e);
    return { code: -1, message: '网络请求失败，请稍后重试' };
  }
}

const api = {
  auth: {
    login: (data, router) => request('/api/employee/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }, router),
    logout: (router) => request('/api/employee/logout', {
      method: 'POST'
    }, router)
  },
  employee: {
    getProfile: (router) => request('/api/employee/profile', {}, router),
    getStats: (router) => request('/api/employee/stats', {}, router),
    getInfo: (router) => request('/api/employee', {}, router)
  },
  tasks: {
    getList: (params, router) => {
      const searchParams = new URLSearchParams();
      if (params.month) searchParams.append('month', params.month);
      if (params.type) searchParams.append('type', params.type);
      if (params.status) searchParams.append('status', params.status);
      return request(`/api/employee/tasks?${searchParams.toString()}`, {}, router);
    },
    getSummary: (month, router) => {
      const searchParams = new URLSearchParams();
      if (month) searchParams.append('month', month);
      return request(`/api/employee/tasks/summary?${searchParams.toString()}`, {}, router);
    }
  },
  training: {
    getList: (params, router) => {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.append('category', params.category);
      if (params.level) searchParams.append('level', params.level);
      return request(`/api/employee/training?${searchParams.toString()}`, {}, router);
    },
    getCategories: (router) => request('/api/employee/training/categories', {}, router),
    getStats: (router) => request('/api/employee/training/stats', {}, router),
    getDetail: (id, router) => request(`/api/employee/training/${id}`, {}, router),
    updateProgress: (id, progress, router) => request(`/api/employee/training/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ progress })
    }, router)
  },
  security: {
    changePassword: (data, router) => request('/api/employee/security/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    }, router),
    getSettings: (router) => request('/api/employee/security/settings', {}, router),
    logoutDevice: (deviceId, router) => request('/api/employee/security/logout-device', {
      method: 'POST',
      body: JSON.stringify({ deviceId })
    }, router)
  }
};

export default api;
export { getAuthHeaders, handleAuthError };
