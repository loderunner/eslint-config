type Fruit = 'apple' | 'banana' | 'cherry';

export function describeFruit(fruit: Fruit): string {
  switch (fruit) {
    case 'apple':
      return 'an apple';
    case 'banana':
      return 'a banana';
  }
}
