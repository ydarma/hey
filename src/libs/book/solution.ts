import $ from "cash-dom";

export function solution(): void {
  const solutions = $(".language-hey").filter((_, e) => {
    return /^;.*solution$/.test(e.firstChild?.textContent ?? "");
  });
  solutions.each((_, e) => {
    const exercise = $(e).parent().children();
    let hidden = true;
    const button = $("<button/>")
      .text("Montrer la solution")
      .addClass("btn btn-outline-secondary btn-sm m-2")
      .on({
        click: () => {
          if (hidden) {
            $(exercise).show();
            button.text("Masquer la solution");
          } else {
            $(exercise).hide();
            button.text("Montrer la solution");
          }
          hidden = !hidden;
        },
      });
    $(exercise).parent().append(button);
    $(exercise).hide();
  });
}
