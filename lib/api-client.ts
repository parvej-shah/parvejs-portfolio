import {
  assetSchema,
  createPostSchema,
  createProjectSchema,
  getSectionSchema,
  postSchema,
  projectSchema,
  type SectionKey,
  updatePostSchema,
  updateProjectSchema,
} from "@/lib/validators";
import type {
  Asset,
  CreatePost,
  CreateProject,
  Post,
  Project,
  SectionData,
  UpdatePost,
  UpdateProject,
} from "@/lib/types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | null | object;
};

async function request<T>(input: string, schema: { parse: (value: unknown) => T }, init?: RequestOptions) {
  const rawBody = init?.body;
  const isFormData = rawBody instanceof FormData;
  let body: BodyInit | null = null;

  if (typeof rawBody === "string" || rawBody instanceof Blob || rawBody instanceof URLSearchParams) {
    body = rawBody;
  } else if (rawBody && !isFormData) {
    body = JSON.stringify(rawBody);
  } else if (isFormData) {
    body = rawBody;
  }

  const response = await fetch(input, {
    ...init,
    headers: isFormData
      ? init?.headers
      : {
          "Content-Type": "application/json",
          ...init?.headers,
        },
    body,
    credentials: "same-origin",
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    let message = fallbackMessage;

    try {
      const payload = (await response.json()) as { error?: string; message?: string };
      message = payload.error ?? payload.message ?? fallbackMessage;
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return schema.parse(null);
  }

  return schema.parse(await response.json());
}

export const apiClient = {
  getProjects() {
    return request("/api/projects", projectSchema.array());
  },
  getProject(id: string) {
    return request(`/api/projects/${id}`, projectSchema);
  },
  createProject(input: CreateProject) {
    return request("/api/projects", projectSchema, {
      method: "POST",
      body: createProjectSchema.parse(input),
    });
  },
  updateProject(id: string, input: UpdateProject) {
    return request(`/api/projects/${id}`, projectSchema, {
      method: "PATCH",
      body: updateProjectSchema.parse(input),
    });
  },
  deleteProject(id: string) {
    return fetch(`/api/projects/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    }).then((response) => {
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    });
  },
  getPosts() {
    return request("/api/posts", postSchema.array());
  },
  getPost(id: string) {
    return request(`/api/posts/${id}`, postSchema);
  },
  getSection<K extends SectionKey>(key: K) {
    const schema = getSectionSchema(key) as unknown as { parse: (value: unknown) => SectionData<K> };
    return request(`/api/content/${key}`, schema);
  },
  createPost(input: CreatePost) {
    return request("/api/posts", postSchema, {
      method: "POST",
      body: createPostSchema.parse(input),
    });
  },
  updatePost(id: string, input: UpdatePost) {
    return request(`/api/posts/${id}`, postSchema, {
      method: "PATCH",
      body: updatePostSchema.parse(input),
    });
  },
  deletePost(id: string) {
    return fetch(`/api/posts/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    }).then((response) => {
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    });
  },
  updateSection<K extends SectionKey>(key: K, input: SectionData<K>) {
    const schema = getSectionSchema(key) as unknown as { parse: (value: unknown) => SectionData<K> };
    return request(`/api/content/${key}`, schema, {
      method: "PUT",
      body: schema.parse(input),
    });
  },
  async uploadAsset(file: File): Promise<Asset> {
    const formData = new FormData();
    formData.set("file", file);

    return request("/api/upload", assetSchema, {
      method: "POST",
      body: formData,
    });
  },
};

export type { Project, Post, SectionKey, SectionData };
