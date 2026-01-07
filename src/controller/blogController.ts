import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as blogService from "../service/blogService";

import { CustomError } from "../middleware/errorHandler";

export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError("User not authenticated", 401);
    }
    
    const { header, description, content, author } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let thumbImage: string | undefined;
    
    let contentImages: string[] | undefined;

    if (files) {
      if (files.thumbImage && files.thumbImage.length > 0) {
        thumbImage = `/uploads/blogs/${files.thumbImage[0].filename}`;
      }
      
      if (files.contentImages && files.contentImages.length > 0) {
        contentImages = files.contentImages.map(
          (file) => `/uploads/blogs/${file.filename}`
        );
      }
    }

    if (!header || !content || !author) {
      throw new CustomError("Header, content, and author are required", 400);
    }

    const blog = await blogService.createBlog({
      header,
      description,
      content,
      author,
      thumbImage,
      contentImages,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    throw error;
  }
};

export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { header, description, content, author } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let thumbImage: string | undefined;

    let contentImages: string[] | undefined;

    if (files) {
      if (files.thumbImage && files.thumbImage.length > 0) {
        thumbImage = `/uploads/blogs/${files.thumbImage[0].filename}`;
      }

      if (files.contentImages && files.contentImages.length > 0) {
        contentImages = files.contentImages.map(
          (file) => `/uploads/blogs/${file.filename}`
        );
      }
    }

    if (!id) {
        throw new CustomError("Blog ID is required", 400);
    }

    const blog = await blogService.updateBlog(id, {
      header,
      description,
      content,
      author,
      thumbImage,
      contentImages,
    });

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
        throw new CustomError("Blog ID is required", 400);
    }

    await blogService.deleteBlog(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
 
export const getAllBlogs = async (_: Request, res: Response): Promise<void> => {
  try {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    throw error;
  }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
     if (!id) {
        throw new CustomError("Blog ID is required", 400);
    }
    const blog = await blogService.getBlogById(id);

    if (!blog) {
      throw new CustomError("Blog not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    throw error;
  }
};
