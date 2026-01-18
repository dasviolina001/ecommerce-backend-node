import { prisma } from "../db/prisma";

import { PolicyPageContent } from "../generated/prisma/client";

export const createPolicyPageContent = async (data: {
    title: string;
    content: any;
}): Promise<PolicyPageContent> => {
    return await prisma.policyPageContent.create({
        data: {
            title: data.title,
            content: data.content,
        },
    });
};

export const getAllPolicyPageContent = async () => {
    return await prisma.policyPageContent.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getPolicyPageContentById = async (id: string) => {
    return await prisma.policyPageContent.findUnique({
        where: { id },
    });
};

export const updatePolicyPageContent = async (
    id: string,
    data: {
        title?: string;
        content?: any;
    }
) => {
    return await prisma.policyPageContent.update({
        where: { id },
        data: {
            title: data.title,
            content: data.content,
        },
    });
};

export const deletePolicyPageContent = async (id: string) => {
    return await prisma.policyPageContent.delete({
        where: { id },
    });
};
