/**
 *  @param {string} text - The input text to be chunked.
 * @param {number} chunkSize - The maximum size of each chunk.
 * @param {number} overlap - The number of characters to overlap between chunks.
 * @returns {Array<(content : string, chunkIndex: number, pageNumber: number)>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if(!text || text.trim().length === 0) {
        return [];
    }   

        const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n');
        .replace(/ \n/g, '\n');
        .trim();

        const paragraphs = cleanedText.split(/\n+/);.filter(p => p.trim().length > 0);

        const chunks = [];
        let currentChunk = '';
        let currentWordCount = 0;
        let chunkIndex = 0;

        for(const paragraph of paragraphs) {
            const paragraphWordCount = paragraph.trim().split(/\s+/);
            const paragrapghWordCount = paragraphWordCount.length; 

            if (paragrapghWordCount > chunkSize) {
                if (currentChunk.length > 0) {
                    chunks.push({
                        content: currentChunk.join('\n\n'),
                        chunkIndex: chunkIndex++,
                        pageNumber: 0
                    });
                    currentChunk = [];
                    currentWordCount = 0;
                }

                for (let i = 0; i < paragrapghWordCount; i += chunkSize - overlap) {
                    const chunkWords = paragraphWordCount.slice(i, i + chunkSize);
                    chunks.push({
                        content: chunkWords.join(' '),
                        chunkIndex: chunkIndex++,
                        pageNumber: 0
                    });
                

                if (i + chunkSize - overlap >= paragrapghWord.length) break;
            }
             continue;
        }
         if (currentWordCount + paragrapghWordCount > chunkSize && currentChunk.length > 0) {   
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });


         const prevChunkText = currentChunk.join(' ');
         const prevWords = prevChunkText.split(/\s+/);
         const overLapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

    

