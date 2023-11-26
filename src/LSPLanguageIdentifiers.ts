// noinspection JSUnusedGlobalSymbols
export enum LanguageIdentifiers {
  // BAT = "bat",
  // BIBTEX = "bibtex",
  // CLOJURE = "clojure",
  // COFFEESCRIPT = "coffeescript",
  // C = "c",
  // CPP = "cpp",
  // CSHARP = "csharp",
  // CSS = "css",
  // DIFF = "diff",
  // DOCKERFILE = "dockerfile",
  // FSHARP = "fsharp",
  // GIT_COMMIT = "git-commit",
  // GIT_REBASE = "git-rebase",
  // GO = "go",
  // GROOVY = "groovy",
  // HANDLEBARS = "handlebars",
  // HTML = "html",
  // INI = "ini",
  // JAVA = "java",
  JAVASCRIPT = 'javascript',
  // JSON = "json",
  // LATEX = "latex",
  // LESS = "less",
  // LUA = "lua",
  // MAKEFILE = "makefile",
  // MARKDOWN = "markdown",
  // OBJECTIVE_C = "objective-c",
  // OBJECTIVE_CPP = "objective-cpp",
  // PERL = "perl",
  // PHP = "php",
  // POWERSHELL = "powershell",
  // PUG = "jade",
  PYTHON = 'python',
  // R = "r",
  // RAZOR = "razor",
  // RUBY = "ruby",
  // RUST = "rust",
  // SASS = "sass",
  // SCSS = "scss",
  // SHADERLAB = "shaderlab",
  // SHELL_SCRIPT = "shellscript",
  // SQL = "sql",
  // SWIFT = "swift",
  TYPESCRIPT = 'typescript',
  // TEX = "tex",
  // VB = "vb",
  // XML = "xml",
  // XSL = "xsl",
  // YAML = "yaml",
}

export interface LanguageServer {
  port: number;
  extensions: string[];
}
