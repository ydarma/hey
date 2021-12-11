import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import { Mode } from "./syntax";
import { HeyError } from "../hey";

export class Editor {
  private marker = 0;
  private readonly editor;

  constructor(container: string) {
    this.editor = ace.edit(container, {
      minLines: 5,
      maxLines: 20,
      fontSize: 16,
    });
    this.editor.session.setMode(new Mode());
  }

  setProgram(prog: string): void {
    this.resetError();
    const current = this.editor.session.getValue();
    if (current != prog) this.editor.session.setValue(prog);
  }

  onProgramChange(handler: (prog: string) => void): void {
    this.editor.on("change", () => handler(this.editor.session.getValue()));
  }

  setError(err: HeyError): void {
    this.resetError();
    if (err) {
      const range = new ace.Range(
        err.line - 1,
        err.col - 1,
        err.line - 1,
        err.col + 2
      );
      this.marker = this.editor.session.addMarker(
        range,
        "alert alert-danger err py-2",
        "text"
      );
    }
  }

  private resetError() {
    this.editor.session.removeMarker(this.marker);
    this.marker = 0;
  }
}
