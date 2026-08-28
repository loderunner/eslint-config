class Greeter {
  greeting = 'hello';

  greet(): string {
    return this.greeting;
  }
}

export function getUnboundGreet(greeter: Greeter): () => string {
  return greeter.greet;
}
