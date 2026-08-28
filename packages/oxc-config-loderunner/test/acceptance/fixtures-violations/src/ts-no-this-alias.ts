export class Counter {
  count = 0;

  makeIncrementer(): () => void {
    const self = this;
    return function increment() {
      self.count += 1;
    };
  }
}
