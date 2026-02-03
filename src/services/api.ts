const getBaseUrl = () => {
    const hostname = window.location.hostname;
    // Running backend locally
    return `http://${hostname}:5000/api`;
};

export const API_URL = getBaseUrl();

export const consultGlowIA = async (data: { destinationType: string, companion: string, budget: string }) => {
    const response = await fetch(`${API_URL}/consult`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha na conexão com a IA');
    return response.json();
};

export const generateStyleImage = async (prompt: string, image?: string) => {
    const response = await fetch(`${API_URL}/generate-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, image }),
    });
    if (!response.ok) throw new Error('Falha na geração de imagem');
    return response.json();
};

export const generatePost = async (topic?: string) => {
    const response = await fetch(`${API_URL}/generate-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
    });
    if (!response.ok) throw new Error('Falha ao gerar post');
    return response.json();
};

export const publishPost = async (postData: any) => {
    const response = await fetch(`${API_URL}/publish-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Falha ao publicar post');
    return response.json();
};

export const deletePost = async (id: number) => {
    const response = await fetch(`${API_URL}/delete-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Falha ao deletar post');
    return response.json();
};

export const generateInstaPost = async (topic?: string) => {
    const response = await fetch(`${API_URL}/generate-insta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
    });
    if (!response.ok) throw new Error('Falha ao gerar post do Instagram');
    return response.json();
};

export const regenerateInstaImage = async (topic: string) => {
    const response = await fetch(`${API_URL}/generate-insta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, imageOnly: true }),
    });
    if (!response.ok) throw new Error('Falha ao regenerar imagem');
    return response.json();
};

// Visitors
export const getVisitors = async () => {
    try {
        const response = await fetch(`${API_URL}/visitors`);
        if (!response.ok) return { total: 0, today: 0 };
        return response.json();
    } catch (error) {
        return { total: 0, today: 0 };
    }
};

export const incrementVisitors = async () => {
    try {
        await fetch(`${API_URL}/visitors/increment`, { method: 'POST' });
    } catch (error) {
        console.error("Increment failed", error);
    }
};

// Marketing Zap
export const generateZapAds = async (topic: string) => {
    const response = await fetch(`${API_URL}/generate-zap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
    });
    if (!response.ok) throw new Error('Falha ao gerar anúncios');
    return response.json();
};


export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload-image`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Falha ao fazer upload da imagem');
    return response.json();
};

export const updateBlogImages = async (data: { postId: number | string, coverImage?: string, contentImages?: Record<string, string> }) => {
    const response = await fetch(`${API_URL}/update-blog-images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao atualizar imagens do post');
    return response.json();
};
