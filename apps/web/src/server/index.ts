import { getServerSession } from "next-auth";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface CreateContextOptions {
    session: Awaited<ReturnType<typeof getServerSession>> | null;
}

interface SessionUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface Session {
    user: SessionUser;
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        db,
    };
};

export const createTRPCContext = async () => {
    const session = await getServerSession(authOptions);

    return createInnerTRPCContext({
        session,
    });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;


export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const session = ctx.session as Session;

    return next({
        ctx: {
            session: {
                ...session,
                user: session.user
            },
        },
    });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);