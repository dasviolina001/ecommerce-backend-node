import { prisma } from "../db/prisma";

import { AboutPageContent } from "../generated/prisma/client";

export const createAboutPageContent = async (data: {
    title: string;
    content: any;
}): Promise<AboutPageContent> => {
    return await prisma.aboutPageContent.create({
        data: {
            title: data.title,
            content: data.content,
        },
    });
};

export const getAllAboutPageContent = async () => {
    return await prisma.aboutPageContent.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getAboutPageContentById = async (id: string) => {
    return await prisma.aboutPageContent.findUnique({
        where: { id },
    });
};

export const updateAboutPageContent = async (
    id: string,
    data: {
        title?: string;
        content?: any;
    }
) => {
    return await prisma.aboutPageContent.update({
        where: { id },
        data: {
            title: data.title,
            content: data.content,
        },
    });
};

export const deleteAboutPageContent = async (id: string) => {
    return await prisma.aboutPageContent.delete({
        where: { id },
    });
};
