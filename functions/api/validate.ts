import { validate } from "../../src/compiler/LuauCompiler.js";

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body = await context.request.json() as { code?: unknown };
    if (typeof body.code !== "string") return Response.json({ error: "Invalid 'code' parameter" }, { status: 400 });
    return Response.json(validate(body.code));
  } catch (err: any) {
    return Response.json({ error: `Server error: ${err?.message || "Unknown error"}` }, { status: 500 });
  }
};
