import { prisma } from "../db/prisma";

import { Blog } from "../generated/prisma/client";

export const createBlog = async (data: {
  header: string;
  description?: string;
  content: string;
  author: string;
  thumbImage?: string;
  contentImages?: string[];
}): Promise<Blog> => {
  return await prisma.blog.create({
    data: {
      ...data,
      contentImages: data.contentImages ? (data.contentImages as any) : undefined,
    },
  });
};

export const getAllBlogs = async () => {
  return await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBlogById = async (id: string) => {
  return await prisma.blog.findUnique({
    where: { id },
  });
};

export const updateBlog = async (
  id: string,
  data: {
    header?: string;
    description?: string;
    content?: string;
    author?: string;
    thumbImage?: string;
    contentImages?: string[];
  }
) => {
  return await prisma.blog.update({
    where: { id },
    data: {
      ...data,
      contentImages: data.contentImages ? (data.contentImages as any) : undefined,
    },
  });
};

export const deleteBlog = async (id: string) => {
  return await prisma.blog.delete({
    where: { id },
  });
};
