declare module 'd3-cloud' {
    export interface Word {
        text: string;
        size: number;
        x?: number;
        y?: number;
        rotate?: number;
        font?: string;
        style?: string;
        padding?: number;
    }
    
    export interface CloudLayout<T extends Word = Word> {
        start(): CloudLayout<T>;
        stop(): CloudLayout<T>;
        words(words: T[]): CloudLayout<T>;
        size(size: [number, number]): CloudLayout<T>;
        font(font: string | ((d: T) => string)): CloudLayout<T>;
        fontSize(size: (d: T) => number): CloudLayout<T>;
        rotate(rotate: (d: T) => number): CloudLayout<T>;
        padding(padding: number | ((d: T) => number)): CloudLayout<T>;
        on(type: 'end', listener: (words: T[]) => void): CloudLayout<T>;
        on(type: 'word', listener: (word: T) => void): CloudLayout<T>;
    }
    
    function cloud<T extends Word = Word>(): CloudLayout<T>;
    export default cloud;
}