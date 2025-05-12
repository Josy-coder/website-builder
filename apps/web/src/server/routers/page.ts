import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "../index";
import {TRPCError} from "@trpc/server";
import {Prisma} from "@prisma/client";

const elementStylesSchema = z.object({
    position: z.enum(["absolute", "relative", "static", "fixed"]).optional(),
    left: z.string().optional(),
    top: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    backgroundColor: z.string().optional(),
    color: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    padding: z.string().optional(),
    margin: z.string().optional(),
    border: z.string().optional(),
    borderRadius: z.string().optional(),
    display: z.string().optional(),
    flexDirection: z.string().optional(),
    justifyContent: z.string().optional(),
    alignItems: z.string().optional(),
    gap: z.string().optional(),
    zIndex: z.number().optional(),
}).passthrough();

const elementSchema: z.ZodSchema = z.object({
    id: z.string(),
    type: z.enum(["container", "text", "image", "button", "form", "input", "custom"]),
    content: z.string().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    styles: elementStylesSchema,
    props: z.record(z.any()).optional(),
    parentId: z.string().nullable(),
    children: z.lazy((): z.ZodArray<z.ZodTypeAny> => z.array(elementSchema)),
});

const pageLayoutSchema = z.object({
    elements: z.array(elementSchema),
});

const pageMetaSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    robots: z.string().optional(),
}).passthrough();

type PageMeta = Prisma.JsonValue;

export const pageRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const page = await ctx.db.page.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    project: {
                        include: {
                            members: true,
                        },
                    },
                },
            });

            if (!page) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Page not found",
                });
            }

            const projectMember = page.project.members.find(
                (member) => member.userId === userId
            );

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have access to this page",
                });
            }

            return page;
        }),

    getByProjectIdAndSlug: protectedProcedure
        .input(z.object({ projectId: z.string(), slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: input.projectId,
                    userId,
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have access to this project",
                });
            }

            const page = await ctx.db.page.findUnique({
                where: {
                    projectId_slug: {
                        projectId: input.projectId,
                        slug: input.slug,
                    },
                },
            });

            if (!page) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Page not found",
                });
            }

            return page;
        }),

    getAllByProject: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: input.projectId,
                    userId,
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have access to this project",
                });
            }

            return await ctx.db.page.findMany({
                where: {
                    projectId: input.projectId,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
        }),

    create: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                name: z.string().min(1),
                slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
                renderMode: z.enum(["STATIC", "SERVER", "INCREMENTAL", "CLIENT"]).default("STATIC"),
                meta: pageMetaSchema.optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: input.projectId,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN", "EDITOR"],
                    },
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to create pages in this project",
                });
            }

            const existingPage = await ctx.db.page.findUnique({
                where: {
                    projectId_slug: {
                        projectId: input.projectId,
                        slug: input.slug,
                    },
                },
            });

            if (existingPage) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "A page with this slug already exists in this project",
                });
            }

            const metaData: PageMeta = input.meta
                ? (input.meta as PageMeta)
                : {
                    title: input.name,
                    description: "",
                };

            return await ctx.db.page.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                    projectId: input.projectId,
                    renderMode: input.renderMode,
                    meta: metaData as Prisma.InputJsonValue,
                    layout: {
                        elements: []
                    } as Prisma.InputJsonValue,
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
                layout: pageLayoutSchema.optional(),
                meta: pageMetaSchema.optional(),
                renderMode: z.enum(["STATIC", "SERVER", "INCREMENTAL", "CLIENT"]).optional(),
                isPublished: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const page = await ctx.db.page.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    project: true,
                },
            });

            if (!page) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Page not found",
                });
            }

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: page.projectId,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN", "EDITOR"],
                    },
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to update this page",
                });
            }

            if (input.slug && input.slug !== page.slug) {
                const existingPage = await ctx.db.page.findFirst({
                    where: {
                        projectId: page.projectId,
                        slug: input.slug,
                        id: {
                            not: input.id,
                        },
                    },
                });

                if (existingPage) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "A page with this slug already exists in this project",
                    });
                }
            }

            const updateData: any = {};

            if (input.name) updateData.name = input.name;
            if (input.slug) updateData.slug = input.slug;
            if (input.layout) updateData.layout = input.layout as Prisma.InputJsonValue;
            if (input.meta) updateData.meta = input.meta as Prisma.InputJsonValue;
            if (input.renderMode) updateData.renderMode = input.renderMode;
            if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;

            return await ctx.db.page.update({
                where: {
                    id: input.id,
                },
                data: updateData,
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const page = await ctx.db.page.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    project: true,
                },
            });

            if (!page) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Page not found",
                });
            }

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: page.projectId,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to delete this page",
                });
            }

            if (page.slug === "index") {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Cannot delete the home page",
                });
            }

            await ctx.db.page.delete({
                where: {
                    id: input.id,
                },
            });

            return {
                success: true,
            };
        }),
});