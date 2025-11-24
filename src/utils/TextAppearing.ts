export function streamText(
    text: string,
    onChunk: (chunk: string, isOver: boolean) => void,
    speed: number
) {
    let i = 0;

    function typeNext() {
        if (i < text.length) {
            onChunk(text.slice(0, i + 1), false);
            i++;
            setTimeout(typeNext, speed);
        } else {
            onChunk(text, true); // signal that streaming is finished
        }
    }

    typeNext();
}


export function containsCodeBlock(content: string): boolean {
    // Match ``` optionally followed by language, then code, then ```
    const codeBlockRegex = /```[a-zA-Z]*\n[\s\S]*?\n```/g;
  
    return codeBlockRegex.test(content);
  }
  