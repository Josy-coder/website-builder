import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../index";
import { workspaceRouter } from "./workspace";
import { projectRouter } from "./project";
import { pageRouter } from "./page";

export const appRouter = createTRPCRouter({
    workspace: workspaceRouter,
    project: projectRouter,
    page: pageRouter,
    health: publicProcedure.query(() => {
        return {
            status: "ok",
            timestamp: new Date(),
        };
    }),
    getSession: publicProcedure.query(({ ctx }) => {
        return ctx.session;
    }),
    getSecretMessage: protectedProcedure.query(() => {
        return "You are logged in and can see this secret message!";
    }),
});

export type AppRouter = typeof appRouter;