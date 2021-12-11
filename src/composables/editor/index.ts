import { onMounted } from "vue";
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import { Mode } from "./syntax";
import { HeyError } from "../hey";

export default function (container = "editor"): {
  edit: (prog: string) => Promise<void>;
  onChange: (handler: (prog: string) => void) => Promise<void>;
  setError: (err: HeyError) => Promise<void>;
} {
  let resolve: (e: ace.Ace.Editor) => void;
  const editor: Promise<ace.Ace.Editor> = new Promise((r) => (resolve = r));
  onMounted(() => {
    const editor = ace.edit(container, {
      maxLines: 20,
      fontSize: 16,
    });
    editor.session.setMode(new Mode());
    resolve(editor);
  });
  let marker = 0;
  return {
    edit: (prog: string) =>
      editor.then((ed) => {
        const current = ed.session.getValue();
        if (current != prog) ed.session.setValue(prog);
      }),
    onChange: (handler: (prog: string) => void) =>
      editor.then((ed) => {
        ed.on("change", () => handler(ed.session.getValue()));
      }),
    setError: (err: HeyError) =>
      editor.then((ed) => {
        ed.session.removeMarker(marker);
        marker = 0;
        if (err) {
          const range = new ace.Range(
            err.line - 1,
            err.col - 1,
            err.line - 1,
            err.col + 2
          );
          marker = ed.session.addMarker(
            range,
            "alert alert-danger err py-2",
            "text"
          );
        }
      }),
  };
}
