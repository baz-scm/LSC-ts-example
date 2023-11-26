import * as fs from 'fs';
import CAPABILITIES from './capabilities.json';
import {LanguageIdentifiers, LanguageServer} from './LSPLanguageIdentifiers';
import path from 'path';
import {TextDocument} from './TextDocument';
import {FilePosition} from './FilePosition';
import {LSPFileLocation} from './LSPFileLocation';

const Client = require('rpc-websockets').Client;

const HOST = process.env.WS_HOST || 'localhost';

const LANGUAGE_SERVERS: Record<LanguageIdentifiers, LanguageServer> = {
  [LanguageIdentifiers.PYTHON]: {port: 2087, extensions: ['.py']},
  [LanguageIdentifiers.TYPESCRIPT]: {port: 2089, extensions: ['.ts']},
  [LanguageIdentifiers.JAVASCRIPT]: {port: 2089, extensions: ['.js']},
};

const walkDir = (dir: string, extensions = ['']): string[] => {
  return fs.readdirSync(dir).flatMap(entry => {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      return walkDir(fullPath);
    }
    if (extensions && !extensions.some(e => fullPath.endsWith(e))) {
      return [];
    }
    return [fullPath];
  });
};

async function callLsp(
  rootUri: string,
  lang: LanguageIdentifiers
): Promise<number> {
    const ls = LANGUAGE_SERVERS[lang];
    const rpcClient = new Client(`ws://${HOST}:${ls.port}`);
  const files = walkDir(rootUri, ls.extensions);
  rpcClient.on('open', async () => {
    rpcClient.on('textDocument/publishDiagnostics', () => {
      console.log('Got a publishDiagnostics request, skipping');
    });
    await rpcClient.call('initialize', {
      rootUri,
      capabilities: CAPABILITIES,
    });

    await rpcClient.call('initialized');
    for (const file of files) {
      if (ls.extensions.some(e => file.endsWith(e))) {
        const document = fs.readFileSync(file).toString();
        const textDocument = new TextDocument(file, lang, document);
        await rpcClient.call('textDocument/didOpen', {document, textDocument});
      }
    }
    const interestingFile = path.join(rootUri, 'json_rpc_encoder.py');
    const textDocument = new TextDocument(interestingFile, lang);
    const symbols = await rpcClient.call('textDocument/documentSymbol', {
      textDocument,
    });
    console.log(JSON.stringify(symbols, null, 4));
    const fileReferences: {[word_position: string]: LSPFileLocation} = {};
    const fileDefinitions: {[word_position: string]: LSPFileLocation} = {};

    for (const f of files) {
      const interestingFileContent = fs.readFileSync(f).toString();
      let interestingFileLines: string[];
      if (interestingFileContent.includes('\r\n')) {
        interestingFileLines = interestingFileContent.split('\r\n');
      } else {
        interestingFileLines = interestingFileContent.split('\n');
      }
      const computedReferences: Set<string> = new Set();
      for (let i = 0; i < interestingFileLines.length; i++) {
        const lineText = interestingFileLines[i];
        const words = lineText.split(/\s+|\)|\(|:|=|,|\./);
        for (const w of words) {
          if (w) {
            const position = new FilePosition(i, lineText.indexOf(w));
            const definitions = await rpcClient.call(
              'textDocument/definition',
              {
                textDocument: {uri: f},
                position,
              }
            );
            if (definitions.length > 0) {
              const localDefs = definitions.filter((d: LSPFileLocation) =>
                d['uri'].startsWith(rootUri)
              );
              if (localDefs.length > 0) {
                fileDefinitions[`${f}:${position.toString()}:${w}`] =
                  definitions;
              }
            }
            if (!computedReferences.has(w)) {
              fileReferences[`${f}:${position.toString()}:${w}`] =
                await rpcClient.call('textDocument/references', {
                  textDocument: {uri: f},
                  position,
                  context: {includeDeclaration: true},
                });
              computedReferences.add(w);
            }
          }
        }
      }
    }

    fs.writeFileSync(
      '../../results/file_references.json',
      JSON.stringify(fileReferences, null, 2)
    );
    fs.writeFileSync(
      '../../results/file_definitions.json',
      JSON.stringify(fileDefinitions, null, 2)
    );

    rpcClient.close();
  });

  return 0;
}

const rootUri = path.join(path.dirname(path.dirname(__dirname)), "scn-webhook-listener", "listener");
callLsp(rootUri, LanguageIdentifiers.PYTHON)
  .then(() => console.log('Success'))
  .catch(e => console.error(e));
