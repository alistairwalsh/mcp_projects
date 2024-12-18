declare module '@modelcontextprotocol/server-brave-search/dist/index.js' {
    export class BraveSearchServer {
        constructor(options: {
            apiKey: string;
            name: string;
            version: string;
        });
        connect(transport: any): Promise<void>;
        close(): Promise<void>;
    }
}
