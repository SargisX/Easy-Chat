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


// frontend utility: marks a message for deep research
export function prepareDeepResearchPrompt(message: string): string {
    // Unique marker, could be anything unlikely in normal text
    const DEEP_MARKER = "[DEEP_RESEARCH]";
    
    // Base instruction for AI
    let prompt = message.trim();
    
    // If short message, encourage longer response
    if (prompt.length < 50) {
      prompt += " Please provide a detailed and thorough answer, at least 100 words.";
    }
  
    // Always include marker
    prompt += ` ${DEEP_MARKER}`;
  
    return prompt;
  }
  