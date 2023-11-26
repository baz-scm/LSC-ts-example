# Example Language Server Client
This repository is an example LS client, which communicates with an LS server  using 
websocket and the LS Protocol (LSP).

The client loads all the files, then iterates over them and collects all the 
definitions and references that they contain.

## Running locally
To get it to run locally, you should:
1. Install python LSP via:
    
    ```shell
    pip3 install websockets python-lsp-server
    pylsp --w &
    ```
2. Update the path in [index.ts](/src/index.ts) (line 125, `rootUri`).
3. Debug the run!
