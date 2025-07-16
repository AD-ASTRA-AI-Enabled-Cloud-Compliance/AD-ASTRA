'server only'


export async function buildHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
    };
}

export async function apiCallBuilder(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
    uuid: string | null = null,
    data: unknown = null
) {
    const url = process.env.NEXT_PUBLIC_API_URL;

    // Append the uuid to the endpoint if it exists, according to the API design
    const urlEndpoint = `${url}:${endpoint}${uuid ? `${uuid}` : ''}`;
    const xsrfToken = getCookie('XSRF-TOKEN');
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrfToken ?? '',
    };

    console.log('endpoint:', endpoint);
    const options: RequestInit = {
        method,
        credentials: "include",
        headers,
    };
    if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    } else if (data instanceof FormData) {
        options.body = data;
    }

    console.log(urlEndpoint);
    const response = await fetch(urlEndpoint, options);
    console.log(response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
        const text = await response.text();
        console.log(text);

        if (response.status === 401) {
            console.error("Unauthorized access. Please log in again.");
            apiCallBuilderLogout('POST_Logout')
            window.location.href = '/login';

            return null;
        }
        // const errorText = await response.text();
        // console.error("Error status:", response.status);
        // console.error("Error:", response.status, response.statusText);
        // console.error("API Error (text):", errorText);
        return response;

    }

    return response;
}
const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

export async function apiCallBuilderLogin(endpoint: string, email: string, password: string) {
    
    const url = process.env.NEXT_PUBLIC_API_URL;

    const urlEndpoint = `${url}login`;

    const urlEndpointCSRF = `http://127.0.0.1:8000/sanctum/csrf-cookie`;

    await fetch(urlEndpointCSRF, {
        method: "GET",
        credentials: "include",
    });

    const xsrfToken = getCookie('XSRF-TOKEN');

    document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
        const response = await fetch(urlEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'X-XSRF-TOKEN': xsrfToken ?? '',
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });


        if (!response.ok) throw new Error("Login failed");

        const res = await response.json();
        console.log(res);


        return res.data;
    } catch {
        // console.error("Login error:", error);
        console.error("Login error");
        // throw error; 
    }
}


export async function apiCallBuilderLogout(endpoint: string) {
    
    const url = process.env.NEXT_PUBLIC_API_URL;

    const urlEndpoint = `${url}${endpoint}`;

    document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = '/login';
    try {
        const response = await fetch(urlEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error("Login failed");

        window.location.href = '/login';

        console.log('logout successful')
    } catch (error) {
        console.log("Login error:", error);
        // throw error; 
    }
}