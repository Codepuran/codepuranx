type SentCommand = { constructor: { name: string }; input: unknown };

export class FakeDocumentClient {
  readonly sent: SentCommand[] = [];
  private responses: unknown[] = [];

  queueResponse(response: unknown): void {
    this.responses.push(response);
  }

  async send(command: SentCommand): Promise<unknown> {
    this.sent.push(command);
    return this.responses.shift() ?? {};
  }
}
