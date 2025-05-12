import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "../index";
import {TRPCError} from "@trpc/server";

export const workspaceRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const workspaceMemberships = await ctx.db.workspaceMember.findMany({
            where: {
                userId,
            },
            include: {
                workspace: true,
            },
        });

        return workspaceMemberships.map((member) => member.workspace);
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const workspaceMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: input.id,
                    userId,
                },
            });

            if (!workspaceMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have access to this workspace",
                });
            }

            const workspace = await ctx.db.workspace.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    projects: true,
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!workspace) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Workspace not found",
                });
            }

            return workspace;
        }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const existingWorkspace = await ctx.db.workspace.findUnique({
                where: {
                    slug: input.slug,
                },
            });

            if (existingWorkspace) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "A workspace with this slug already exists",
                });
            }

            return await ctx.db.workspace.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                    members: {
                        create: {
                            userId,
                            role: "OWNER",
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

            const workspaceMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: input.id,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                },
            });

            if (!workspaceMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to update this workspace",
                });
            }

            if (input.slug) {
                const existingWorkspace = await ctx.db.workspace.findFirst({
                    where: {
                        slug: input.slug,
                        id: {
                            not: input.id,
                        },
                    },
                });

                if (existingWorkspace) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "A workspace with this slug already exists",
                    });
                }
            }

            return await ctx.db.workspace.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    slug: input.slug,
                },
            });
        }),

    addMember: protectedProcedure
        .input(
            z.object({
                workspaceId: z.string(),
                email: z.string().email(),
                role: z.enum(["ADMIN", "EDITOR", "DEVELOPER", "VIEWER"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const workspaceMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: input.workspaceId,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                },
            });

            if (!workspaceMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to add members to this workspace",
                });
            }

            const user = await ctx.db.user.findUnique({
                where: {
                    email: input.email,
                },
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found with this email",
                });
            }

            const existingMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: input.workspaceId,
                    userId: user.id,
                },
            });

            if (existingMember) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User is already a member of this workspace",
                });
            }

            return await ctx.db.workspaceMember.create({
                data: {
                    workspaceId: input.workspaceId,
                    userId: user.id,
                    role: input.role,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            });
        }),

    updateMember: protectedProcedure
        .input(
            z.object({
                memberId: z.string(),
                role: z.enum(["ADMIN", "EDITOR", "DEVELOPER", "VIEWER"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const member = await ctx.db.workspaceMember.findUnique({
                where: {
                    id: input.memberId,
                },
                include: {
                    workspace: true,
                },
            });

            if (!member) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Member not found",
                });
            }

            const currentUserMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: member.workspaceId,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                },
            });

            if (!currentUserMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to update members in this workspace",
                });
            }

            if (member.role === "OWNER" && currentUserMember.role !== "OWNER") {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only owners can update other owners",
                });
            }

            return await ctx.db.workspaceMember.update({
                where: {
                    id: input.memberId,
                },
                data: {
                    role: input.role,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            });
        }),

    removeMember: protectedProcedure
        .input(z.object({ memberId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const member = await ctx.db.workspaceMember.findUnique({
                where: {
                    id: input.memberId,
                },
            });

            if (!member) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Member not found",
                });
            }

            const currentUserMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: member.workspaceId,
                    userId,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                },
            });

            if (!currentUserMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You don't have permission to remove members from this workspace",
                });
            }

            if (member.role === "OWNER" && currentUserMember.role !== "OWNER") {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only owners can remove other owners",
                });
            }

            if (member.userId === userId && member.role === "OWNER") {
                const ownerCount = await ctx.db.workspaceMember.count({
                    where: {
                        workspaceId: member.workspaceId,
                        role: "OWNER",
                    },
                });

                if (ownerCount <= 1) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Cannot remove the last owner of a workspace",
                    });
                }
            }

            await ctx.db.workspaceMember.delete({
                where: {
                    id: input.memberId,
                },
            });

            return {
                success: true,
            };
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const workspaceMember = await ctx.db.workspaceMember.findFirst({
                where: {
                    workspaceId: input.id,
                    userId,
                    role: "OWNER",
                },
            });

            if (!workspaceMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only workspace owners can delete workspaces",
                });
            }

            await ctx.db.workspace.delete({
                where: {
                    id: input.id,
                },
            });

            return {
                success: true,
            };
        }),
});