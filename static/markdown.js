function parseMd(md) {
  //ul
  md = md.replace(/^\s*\n\*/gm, "<ul>\n*");
  md = md.replace(/^(\*.+)\s*\n([^\*])/gm, "$1\n</ul>\n\n$2");
  md = md.replace(/^\*(.+)/gm, "<li>$1</li>");

  //ol
  md = md.replace(/^\s*\n\d\./gm, "<ol>\n1.");
  md = md.replace(/^(\d\..+)\s*\n([^\d\.])/gm, "$1\n</ol>\n\n$2");
  md = md.replace(/^\d\.(.+)/gm, "<li>$1</li>");

  //blockquote
  md = md.replace(/^\>(.+)/gm, "<blockquote>$1</blockquote>");

  //h
  md = md.replace(/[\#]{6}(.+)/g, "<h6>$1</h6>");
  md = md.replace(/[\#]{5}(.+)/g, "<h5>$1</h5>");
  md = md.replace(/[\#]{4}(.+)/g, "<h4>$1</h4>");
  md = md.replace(/[\#]{3}(.+)/g, "<h3>$1</h3>");
  md = md.replace(/[\#]{2}(.+)/g, "<h2>$1</h2>");
  md = md.replace(/[\#]{1}(.+)/g, "<h1>$1</h1>");

  //alt h
  md = md.replace(/^(.+)\n\=+/gm, "<h1>$1</h1>");
  md = md.replace(/^(.+)\n\-+/gm, "<h2>$1</h2>");

  //images
  md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

  //links
  md = md.replace(
    /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,
    '<a href="$2" title="$4">$1</a>'
  );

  //font styles
  md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, "<b>$1</b>");
  md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, "<i>$1</i>");
  md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, "<del>$1</del>");

  //pre
  md = md.replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">');
  md = md.replace(/^\`\`\`\s*\n/gm, "</pre>\n\n");

  //code
  md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, "<code>$1</code>");

  //p
  md = md.replace(/^\s*(\n)?(.+)/gm, function (m) {
    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m)
      ? m
      : "<p>" + m + "</p>";
  });

  //strip p from pre
  md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, "$1$2");

  return md;
}


// 마크 다운 구현
document.addEventListener("DOMContentLoaded", function () {
  var editorEls = document.getElementsByClassName("editor");

  // Iterate over each editor element
  Array.from(editorEls).forEach(function(editorEl) {
    function parse() {
      var md = editorEl.innerHTML;
      editorEl.innerHTML = parseMd(md);

      moveCursorToEnd(editorEl);
    }

    function moveCursorToEnd(el) {
      var range = document.createRange();
      var sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      el.focus(); 
    }

    editorEl.addEventListener("keydown", function (e) {
      //엔터 클릭시
      if (e.keyCode === 13) {
        e.preventDefault();

        parse();

        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);

        var newLine = document.createElement("p");
        newLine.setAttribute("contenteditable", "true");
        editorEl.appendChild(newLine);

        //스크롤 위치 고정
        editorEl.scrollTop = editorEl.scrollHeight;
      }
    });

    parse();
  });
});


/*
var rawMode = true;
(mdEl = document.getElementById("markdown")),
  (outputEl = document.getElementById("output-html")),
  (parse = function () {
    outputEl[rawMode ? "innerText" : "innerHTML"] = parseMd(mdEl.innerText);
  });

parse();
mdEl.addEventListener("keyup", parse, false);

//Raw mode trigger btn
(function () {
  var trigger = document.getElementById("raw-switch"),
    status = trigger.getElementsByTagName("span")[0],
    updateStatus = function () {
      status.innerText = rawMode ? "On" : "Off";
    };

  updateStatus();
  trigger.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      rawMode = rawMode ? false : true;
      updateStatus();
      parse();
    },
    false
  );
})();
*/
