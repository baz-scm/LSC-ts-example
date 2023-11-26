export class TextDocument {
  uri: string;
  languageId: string;
  version = 0;
  text: string | null = null;

  constructor(
    uri: string,
    languageId: string,
    text: string | null = null,
    version = 0
  ) {
    this.uri = uri;
    this.languageId = languageId;
    this.text = text;
    this.version = version;
  }
}
