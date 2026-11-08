import { lex } from "../../src/lexer/Lexer.js";
import { parse } from "../../src/parser/Parser.js";
import { obfuscate } from "../../src/obfuscator/Obfuscator.js";
import { encodeStrings } from "../../src/obfuscator/StringEncoder.js";
import { scrambleControlFlow } from "../../src/obfuscator/ControlFlowScrambler.js";
import { printChunk, printChunkOneLine } from "../../src/obfuscator/Printer.js";
import { compile } from "../../src/vm/Compiler.js";
import { regCompile } from "../../src/vm/RegCompiler.js";
import { generateVM } from "../../src/vm/vm-gen.js";
import { generateRegVM } from "../../src/vm/reg-vm-gen.js";

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body = await context.request.json() as { code?: unknown; options?: any };
    if (typeof body.code !== "string") return Response.json({ error: "Invalid 'code' parameter" }, { status: 400 });
    const { tokens, errors } = lex(body.code);
    if (errors.length) return Response.json({ error: "Lexer error", details: errors }, { status: 400 });
    let ast = parse(tokens);
    const opts = body.options || {};
    if (opts.encodeStrings === true) ast = encodeStrings(ast, { enabled: true });
    if (opts.scramble === true) ast = scrambleControlFlow(ast, { enabled: true });
    const obfuscated = obfuscate(ast, { renameLocals: opts.noRename !== true, preserveGlobals: opts.noPreserve !== true });
    const vmType = opts.vmType || "none";
    const vmLevel = opts.vmLevel || "normal";
    let output: string;
    if (vmType === "stack") output = generateVM(compile(obfuscated), { level: vmLevel, executorGlobals: vmLevel !== "debug" });
    else if (vmType === "register") output = generateRegVM(regCompile(obfuscated), { level: vmLevel, executorGlobals: vmLevel !== "debug", polymorphicSeed: Date.now(), disableFeatures: vmLevel === "debug" ? ["controlFlowFlattening"] as any : [] });
    else output = opts.oneLine === true ? printChunkOneLine(obfuscated) : printChunk(obfuscated);
    return Response.json({ output });
  } catch (err: any) {
    return Response.json({ error: `Obfuscation error: ${err?.message || "Unknown error"}` }, { status: 500 });
  }
};
