export interface LSPFileLocation {
  uri: string;
  range: LSPFileRange;
}

interface LSPFileRange {
  start: {
    line: number;
    character: number;
  };
  end: {
    line: number;
    character: number;
  };
}
