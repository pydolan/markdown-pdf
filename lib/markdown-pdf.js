module.exports = {
  activate: function() {
    atom.workspaceView.command(
      'markdown-pdf:convert', this.convert);
  },

  convert: function() {
    var markdownpdf = require("markdown-pdf"), fs = require("fs"), less = require("less");
    var editor = atom.workspace.getActiveTextEditor();
    var stylePath = atom.packages.activePackages["markdown-preview"].stylesheets[0][0]
    var markdownPath = editor.getPath();
    if (markdownPath.indexOf(".md") == -1){
      alert('Please save the markdown file with a ".md" extension.');
      return;
    };
    var pdfPath = markdownPath.replace(".md", ".pdf");
    var lessStyles = fs.readFileSync(stylePath, 'utf8');
    less.render(lessStyles,
      {
        paths: atom.themes.getImportPaths()
      },
      function(err, css){
        if (err) throw err;
        var cssStyles = css;
        makePdf(cssStyles)
      }
    );

    function makePdf(cssStyles){
      fs.createReadStream(markdownPath)
        .pipe(markdownpdf({cssPath: cssStyles}))
        .pipe(fs.createWriteStream(pdfPath))

      console.log("Converted successfully");
    }
  }
};