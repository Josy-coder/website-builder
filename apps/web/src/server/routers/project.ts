import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "../index";
import {TRPCError} from "@trpc/server";

export const projectRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const projectMembers = await ctx.db.projectMember.findMany({
            where: {
                userId,
            },
            include: {
                project: {
                    include: {
                        workspace: true,
                    },
                },
            },
        });

        return projectMembers.map((member) => member.project);
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: input.id,
                    userId,
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have access to this project",
                });
            }

            const project = await ctx.db.project.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    pages: true,
                    components: true,
                    settings: true,
                    workspace: true,
                    gitRepo: true,
                },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            return project;
        }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                workspaceId: z.string(),
                slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const workspaceMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: input.workspaceId,
                    userId,
                },
            });

            if (!workspaceMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have access to this workspace",
                });
            }

            const existingProject = await ctx.db.project.findUnique({
                where: {
                    workspaceId_slug: {
                        workspaceId: input.workspaceId,
                        slug: input.slug,
                    },
                },
            });

            if (existingProject) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "A project with this slug already exists in this workspace",
                });
            }

            return await ctx.db.project.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                    workspaceId: input.workspaceId,
                    members: {
                        create: {
                            userId,
                            role: "OWNER",
                        },
                    },
                    settings: {
                        create: {
                            basePath: "/",
                            outputDir: "out",
                            buildCommand: "next build",
                            devCommand: "next dev",
                        },
                    },

                    pages: {
                        create: {
                            name: "Home",
                            slug: "index",
                            layout: {
                                elements: []
                            },
                            meta: {
                                title: "Home",
                                description: "Welcome to my website",
                            },
                            renderMode: "STATIC",
                        },
                    },
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: input.id,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                },
                include: {
                    project: true,
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to update this project",
                });
            }

            if (input.slug) {
                const existingProject = await ctx.db.project.findFirst({
                    where: {
                        workspaceId: projectMember.project.workspaceId,
                        slug: input.slug,
                        id: {
                            not: input.id,
                        },
                    },
                });

                if (existingProject) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "A project with this slug already exists in this workspace",
                    });
                }
            }

            return await ctx.db.project.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    slug: input.slug,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const projectMember = await ctx.db.projectMember.findFirst({
                where: {
                    projectId: input.id,
                    userId,
                    role: "OWNER",
                },
            });

            if (!projectMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only project owners can delete projects",
                });
            }

            // Delete project
            await ctx.db.project.delete({
                where: {
                    id: input.id,
                },
            });

            return {
                success: true,
            };
        }),
});