export function parseMessage(content: string) {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const parts: (string | { code: string; language: string })[] = [];
    let match;
  
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index)); // text before code
      }
      parts.push({ language: match[1] || "code", code: match[2] });
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
  
    return parts;
  }
  