import z from "zod";

export const teamSchema = z.object({
    name: z.string().min(1, "Name is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    stadium: z.string().min(1, "Stadium is required"),
});
