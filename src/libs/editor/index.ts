import { onMounted } from "vue";
import { HeyError } from "../hey";
import { Editor } from "./editor";

export default function (container = "editor"): {
  edit: (prog: string) => Promise<void>;
  onChange: (handler: (prog: string) => void) => Promise<void>;
  setError: (err: HeyError) => Promise<void>;
} {
  let resolve: (e: Editor) => void;
  const editor: Promise<Editor> = new Promise((r) => (resolve = r));
  onMounted(() => {
    const editor = new Editor(container);
    resolve(editor);
  });
  return {
    edit: (prog: string) =>
      editor.then((ed) => {
        ed.setProgram(prog);
      }),
    onChange: (handler: (prog: string) => void) =>
      editor.then((ed) => {
        ed.onProgramChange(handler);
      }),
    setError: (err: HeyError) =>
      editor.then((ed) => {
        ed.setError(err);
      }),
  };
}
