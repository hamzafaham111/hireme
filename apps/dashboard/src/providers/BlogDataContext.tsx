import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BlogPost, BlogPostStatus } from '@hire-me/types'
import { apiFetch } from '../lib/api'
import { slugify } from '../lib/slugify'
import { useAuth } from './AuthContext'

export interface CreateBlogPostInput {
  title: string
  excerpt: string
  bodyMarkdown: string
  status: BlogPostStatus
  slug?: string
  authorId: string
  authorName: string
}

export interface UpdateBlogPostInput {
  title: string
  excerpt: string
  bodyMarkdown: string
  status: BlogPostStatus
  slug?: string
}

interface BlogDataContextValue {
  /** Newest `updatedAt` first */
  postsSorted: BlogPost[]
  loading: boolean
  getPost: (id: string) => BlogPost | undefined
  createPost: (input: CreateBlogPostInput) => Promise<BlogPost>
  updatePost: (id: string, input: UpdateBlogPostInput) => Promise<BlogPost>
  removePost: (id: string) => Promise<boolean>
  refreshPosts: () => Promise<void>
  /** Upload a raster image for blog markdown; returns public HTTPS URL on the API host. */
  uploadBlogImage: (file: File) => Promise<string>
}

const BlogDataContext = createContext<BlogDataContextValue | null>(null)

export function BlogDataProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)

  const refreshPosts = useCallback(async () => {
    if (!accessToken) {
      setPosts([])
      return
    }
    setLoading(true)
    try {
      const list = await apiFetch<BlogPost[]>('/blog/posts', { token: accessToken })
      setPosts(list)
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    void refreshPosts()
  }, [refreshPosts])

  const postsSorted = useMemo(
    () => [...posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [posts],
  )

  const getPost = useCallback(
    (id: string) => posts.find((p) => p.id === id),
    [posts],
  )

  const createPost = useCallback(
    async (input: CreateBlogPostInput): Promise<BlogPost> => {
      if (!accessToken) throw new Error('Not signed in.')
      const title = input.title.trim()
      const rawSlug = input.slug?.trim() ? slugify(input.slug) : slugify(title)
      const slug = rawSlug || undefined
      const created = await apiFetch<BlogPost>('/blog/posts', {
        method: 'POST',
        token: accessToken,
        body: {
          title,
          excerpt: input.excerpt.trim(),
          bodyMarkdown: input.bodyMarkdown,
          status: input.status,
          ...(slug ? { slug } : {}),
        },
      })
      setPosts((prev) => [...prev, created])
      return created
    },
    [accessToken],
  )

  const updatePost = useCallback(
    async (id: string, input: UpdateBlogPostInput): Promise<BlogPost> => {
      if (!accessToken) throw new Error('Not signed in.')
      const body: Record<string, unknown> = {
        title: input.title.trim(),
        excerpt: input.excerpt.trim(),
        bodyMarkdown: input.bodyMarkdown,
        status: input.status,
      }
      if (input.slug !== undefined) {
        const s = input.slug.trim()
        if (s) body.slug = s
      }
      const updated = await apiFetch<BlogPost>(`/blog/posts/${id}`, {
        method: 'PATCH',
        token: accessToken,
        body,
      })
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      return updated
    },
    [accessToken],
  )

  const removePost = useCallback(
    async (id: string): Promise<boolean> => {
      if (!accessToken) return false
      try {
        await apiFetch(`/blog/posts/${id}`, { method: 'DELETE', token: accessToken })
        setPosts((prev) => prev.filter((p) => p.id !== id))
        return true
      } catch {
        return false
      }
    },
    [accessToken],
  )

  const uploadBlogImage = useCallback(
    async (file: File): Promise<string> => {
      if (!accessToken) throw new Error('Not signed in.')
      const fd = new FormData()
      fd.append('file', file)
      const res = await apiFetch<{ url: string }>('/blog/uploads/image', {
        method: 'POST',
        token: accessToken,
        body: fd,
      })
      const url = res?.url?.trim()
      if (!url) throw new Error('Upload response missing image URL.')
      return url
    },
    [accessToken],
  )

  const value = useMemo<BlogDataContextValue>(
    () => ({
      postsSorted,
      loading,
      getPost,
      createPost,
      updatePost,
      removePost,
      refreshPosts,
      uploadBlogImage,
    }),
    [
      postsSorted,
      loading,
      getPost,
      createPost,
      updatePost,
      removePost,
      refreshPosts,
      uploadBlogImage,
    ],
  )

  return (
    <BlogDataContext.Provider value={value}>{children}</BlogDataContext.Provider>
  )
}

export function useBlogData() {
  const ctx = useContext(BlogDataContext)
  if (!ctx) throw new Error('useBlogData must be used within BlogDataProvider')
  return ctx
}
