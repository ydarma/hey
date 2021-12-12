import $ from "cash-dom";

export function tryit(loader: (source: string) => void): void {
  $(".language-hey")
    .parent()
    .each((_, e) => {
      $(e).append(
        $("<button/>")
          .text("Essayer")
          .addClass("btn btn-outline-primary btn-sm m-2")
          .on({
            click: () => {
              loader($(e).find("code").prop("innerText").trim());
            },
          })
      );
    });
}
