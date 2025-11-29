export type ParseState = 'initial' | 'in_think_tag' | 'streaming_content';

/**
 * Filters out <think></think> blocks from streaming LLM tokens
 *
 * Handles:
 * - Streaming tokens (one-by-one)
 * - Full cached text (single call)
 * - Split tags across token boundaries
 * - Multiple thinking blocks
 * - Missing closing tags
 */
export class ThinkTagFilter {
  private state: ParseState = 'initial';
  private buffer: string = '';
  private readonly THINK_OPEN = '<think>';
  private readonly THINK_CLOSE = '</think>';

  /**
   * Process a streaming token and return filtered content
   * @param token - Raw token from LLM
   * @returns Filtered content to display (empty string if still in thinking phase)
   */
  processToken(token: string): string {
    this.buffer += token;

    if (this.state === 'initial') {
      const thinkIndex = this.buffer.indexOf(this.THINK_OPEN);

      if (thinkIndex !== -1) {
        // Found opening tag - switch to thinking state
        this.state = 'in_think_tag';

        // Capture any content before <think>
        const beforeThink = this.buffer.substring(0, thinkIndex);
        this.buffer = this.buffer.substring(thinkIndex + this.THINK_OPEN.length);

        // Continue processing in case closing tag is in same token
        if (beforeThink) {
          return beforeThink + this.processToken('');
        }
        return this.processToken('');
      }

      // No opening tag found yet
      // Keep last 7 chars in buffer (length of '<think>') to handle split tags
      if (this.buffer.length > this.THINK_OPEN.length) {
        const output = this.buffer.substring(0, this.buffer.length - this.THINK_OPEN.length);
        this.buffer = this.buffer.substring(this.buffer.length - this.THINK_OPEN.length);
        return output;
      }

      return '';
    }

    if (this.state === 'in_think_tag') {
      const closeIndex = this.buffer.indexOf(this.THINK_CLOSE);

      if (closeIndex !== -1) {
        // Found closing tag - switch to content streaming state
        this.state = 'streaming_content';

        // Discard everything up to and including closing tag
        const afterClose = this.buffer.substring(closeIndex + this.THINK_CLOSE.length);
        this.buffer = '';

        return afterClose;
      }

      // Still inside thinking block - discard tokens
      // Keep last 8 chars in buffer (length of '</think>') to handle split tags
      if (this.buffer.length > this.THINK_CLOSE.length) {
        this.buffer = this.buffer.substring(this.buffer.length - this.THINK_CLOSE.length);
      }

      return '';
    }

    // streaming_content state - pass through all tokens
    const output = this.buffer;
    this.buffer = '';
    return output;
  }

  /**
   * Process full text at once (for cached responses)
   * @param text - Full response text
   * @returns Filtered text with all <think></think> blocks removed
   */
  processFullText(text: string): string {
    // Simple regex approach for full text processing
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  }

  /**
   * Check if we're still in thinking phase
   */
  isThinking(): boolean {
    return this.state === 'initial' || this.state === 'in_think_tag';
  }

  /**
   * Reset filter state for new generation
   */
  reset(): void {
    this.state = 'initial';
    this.buffer = '';
  }
}
