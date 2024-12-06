interface FileSystem {
    readFile(path: string, options?: { encoding?: string }): Promise<string | Uint8Array>;
    writeFile(path: string, data: string): Promise<void>;
}

declare global {
    interface Window {
        fs: FileSystem;
    }
}

export {};