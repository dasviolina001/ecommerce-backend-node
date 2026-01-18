import { prisma } from "../db/prisma";

import { ContactPageInformation } from "../generated/prisma/client";

export const createContactPageInformation = async (data: {
    label: string;
    type: string;
    value: any;
}): Promise<ContactPageInformation> => {
    return await prisma.contactPageInformation.create({
        data: {
            label: data.label,
            type: data.type,
            value: data.value,
        },
    });
};

export const getAllContactPageInformation = async () => {
    return await prisma.contactPageInformation.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getContactPageInformationById = async (id: string) => {
    return await prisma.contactPageInformation.findUnique({
        where: { id },
    });
};

export const updateContactPageInformation = async (
    id: string,
    data: {
        label?: string;
        type?: string;
        value?: any;
    }
) => {
    return await prisma.contactPageInformation.update({
        where: { id },
        data: {
            label: data.label,
            type: data.type,
            value: data.value,
        },
    });
};

export const deleteContactPageInformation = async (id: string) => {
    return await prisma.contactPageInformation.delete({
        where: { id },
    });
};
