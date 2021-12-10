/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import fs from "fs";
import path from "path";
import { matchError } from "./error";
import { HeyActions, IContext } from "./actions";

const heyFile = path.join(__dirname, "/hey.ohm");
const heyText = fs.readFileSync(heyFile).toString();
export const heyGrammar = ohm.grammar(heyText);

function getActions(impl: HeyActions): ohm.ActionDict<unknown> {
  return {
    Prog: (defs, result) =>
      impl.prog({}, () => {
        defs.children.forEach((c) => c.eval());
        return result.eval();
      }),

    Def: (def, id, colon, body) =>
      impl.def(new Context(id, body), id.eval(), body.eval()),

    Val: (v) => impl.value(new Context(v), v.eval()),

    Known: (id) => impl.known(new Context(id), id.eval()),

    Result: (call, lpar, params, rpar) =>
      params.children.reduce(
        (seq, args) =>
          impl.result(
            new Context(call, ...params.children),
            seq,
            ...args.children.map((p) => p.eval())
          ),
        call.eval()
      ),

    Range: (call, lpar, start, end, step, rpar) =>
      impl.range(
        new Context(start, end, step),
        start.eval(),
        end.eval(),
        step.eval()
      ),

    Square: (call, lpar, size, color, rpar) =>
      impl.square(new Context(size, color), size.eval(), color.eval()),

    Concat: (call, lpar, values, rpar) =>
      impl.concat(
        new Context(...values.children),
        ...values.children.map((p) => p.eval())
      ),

    Repeat: (call, lpar, count, values, rpar) =>
      impl.repeat(
        new Context(count, ...values.children),
        count.eval(),
        ...values.children.map((p) => p.eval())
      ),

    Slice: (call, lpar, data, start, end, rpar) =>
      impl.slice(
        new Context(data, start, end),
        data.eval(),
        start.eval(),
        end.children[0]?.eval()
      ),

    Function: (lpar, args, rpar, arrow, body) =>
      impl.funct(
        new Context(...args.children, body),
        args.children.map((p) => p.eval()),
        () => body.eval()
      ),

    comment: (semiColon, comment, eol) => {
      //
    },

    number: (v) => parseInt(v.sourceString),

    color: (n) => n.sourceString,

    string: (rquotes, s, lquotes) => s.sourceString,

    identifier: (id) => id.sourceString,
  };
}

const heySemantics = heyGrammar
  .createSemantics()
  .addOperation<unknown>("eval", getActions(new HeyActions()));

export function hey(source: string): unknown {
  const match = heyGrammar.match(source);
  if (match.failed()) {
    console.log(heyGrammar.trace(source).toString());
    throw matchError(source, match);
  }
  return heySemantics(match).eval();
}

class Context implements IContext {
  private source: string;
  private pos: number[];
  constructor(...nodes: ohm.Node[]) {
    this.source = nodes[0].source.sourceString;
    this.pos = nodes.map((n) => n.source.startIdx);
  }
  get(idx: number): [string, number] {
    return [this.source, this.pos[idx]];
  }
}
