export function parseImageMessage(raw: string) {
    const imgRegex = /\|\$\|(.*?)\|\$\|/; // captures between |$|   |$|

    const match = raw.match(imgRegex);
    const imageUrl = match ? match[1] : null;

    // remove the image part and trim
    const cleanText = raw.replace(imgRegex, "").trim();

    return { cleanText, imageUrl };
  }