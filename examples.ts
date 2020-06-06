typescript_examples



                                                  ADVANCED TS TYPES 

#1_TYPE GUARDS: they allow us to to sth with the data dependin on its runtime type. 

a) instance of 
b) typeof
c)discriminated unions - used with object types


#1_TYPE GUARDS 

type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// interface ElevatedEmployee extends Employee, Admin {}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date()
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {     #1<==== type guard ->if there is more than one type and what we do depends from type, add additional logic
 
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name);
  if ('privileges' in emp) {                                #1<==== if we have a custom type like Employee here, we can't use typeof emp === CustoType. 
                                                                     typeof will work only with tpes that JS knows. In order to check if 'priviliges' exist as a property on employee, use - in - kyeword. 
    console.log('Privileges: ' + emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('Start Date: ' + emp.startDate);
  }
}

printEmployeeInformation({ name: 'Manu', startDate: new Date() });

class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo ...' + amount);
  }
}

type Vehicle = Car | Truck;          <=== depennding on which car we have different logic. 

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {    <=== lodCargo only in Truck - add logic to avoid using loadCargo with Car. Classes are translated to contructor functions. We can check it at the runtime. 
                                          c
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);


#1 c)discriminated unions - used with object types (working with union types, objects and interfaces)

Here some properties are the same but different value. You may use -in- as before - but better add type assignment in an interface. 
If we have one common property describing objects. Instead of checking for existence. 

interface Bird {
  type: 'bird';   <=== as a literal type 
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';    <=== as a literal type 
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case 'bird':                        <== couple of cases if a bird. depending on a case -> do sth 
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
  }
  console.log('Moving at speed: ' + speed);
}

moveAnimal({type: 'bird', flyingSpeed: 10});

#2_TYEPCASTING - when ts does not know a type. 

As an example - if we have DOM and a <p/> [HTMLParagrahElement] <- find by querySelector. 
Imagine looking for sth by id -> Ts deos not not which sepcific HTMl element is that. 
Example: we have user input element -> TS does not read HTML code. In order to tell Ts that this elemnt has a value - 

- give Ts a name for a tag <HTMLInputElement>

- or - use typecasting 

! as HTMLInputElement  <===#2 - u tell Ts that this yields an HTML Input Element. Because, we force Ts to use this it is up to a developer to ensure it exists. and will be of that type. Otherwise, we will get an error, if we want to use it in a way that is not supported.
                          

// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!;
const userInputElement = document.getElementById('user-input')! as HTMLInputElement.  <===  ** By using ! as HTMLInputElement it will not yield null (never return null with !) If we are not sure use additional logic and do typecasting in a block statement. 

I. 

userInputElement.value = 'Hi there!';

II. If we are not sure we will return sth (null is also expected) add additional logic 

if (userInputElement) {
  (userInputElement as HTMLInputElement).value = 'Hi there!';   <=== as HTMLInputElement (wrap an expression inside braces so that it is evaluated first)
}

#3_INDEX_PROPERTIES - 

interface ErrorContainer { // { email: 'Not a valid email', username: 'Must start with a character!' }
  [prop: string]: string;
  id:string; <==u can add predefined types <- u are restricted to types from index properties (u cannot assign a number type) 
}

interface ErrorContainer { // { email: 'Not a valid email', username: 'Must start with a character!' }
  [prop: number]: string; 
}


I want to use this container for every form so I do want to restrict myself to email and username. I do not know what properties I will have and error type

[prop:string] : string 

-string, number, symbol 


const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  username: 'Must start with a capital character!'
  
};

const errorBag: ErrorContainer = {
  1: 'Not a valid email!',
 
#4_ FUNCTION OVERLOADS

Listing of potential results from a function. TS knows all overloads. 

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: number, b: number): number;         <==== #4 
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add('Max', ' Schwarz');
result.split(' ');


#5_OPTIONAL_CHAINING

IF WE DO NOT KNOW IF A PROPERTY EXISTS ->

const result = add('Max', ' Schwarz');
result.split(' ');

const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  job: { title: 'CEO', description: 'My own company' }
};

console.log(fetchedUserData?.job?.title); <================ #5 supported syntax - safely acces object data nested inside. it will compile to basic - if check.

#6_NULLISH COALESCING 

The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand.

const userInput = undefined;

const storedData = userInput ?? 'DEFAULT';

console.log(storedData);

                                     // GENERICS - type connected somehow to another type
                                            //  - FLEXIBLE AND REUSABLE CODE 

on an aray example: (array default type -> array is a type on its own).
const name = [] <== inferred any 

const arr: any[] = []


ARRAY 
// const names: Array<string> = []; // string[]. <== TS knows which methods u can use 
// // names[0].split(' ');

PROMISE TYPE 

// const promise: Promise<number> = new Promise((resolve, reject) => {.   <== main type is a Promise. It returns number.You need to tell TS what type Promise yields. 
//   setTimeout(() => {
//     resolve(10);
//   }, 2000);
// });

// promise.then(data => {
//   // data.split(' ');
// })

GENERIC FUNCTION 

example: fn that merges two object

:one generic type T 
:second generic type: U   ===> TS infers that we return intersection of teo object - with that TS we can access properties with TS. When fn is called type is inferred. 


function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max', hobbies: ['Sports'] }, { age: 30 });

//You do not need to specify types like this. TS infers types for properties. 
const mergedObj = merge<{name:string, hobbies:string[]}, {age:number}}({ name: 'Max', hobbies: ['Sports'] }, { age: 30 });
console.log(mergedObj);

//II. Alternative solution with type casting => this would be very cumbersome

const mergedObj = merge({ name: 'Max', hobbies: ['Sports'] }, { age: 30 }) as {name: string, age: number}


//- - - Working with Constraints - u use - extends - to add constraint 

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max', hobbies: ['Sports'] }, { age: 30 });
console.log(mergedObj);

//Another example: 

interface Lengthy {        <===for Ts it is not clear that property has a length 
  length: number;
}

===> T -> first element generic type 

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value.';
  if (element.length === 1) {
    descriptionText = 'Got 1 element.';
  } else if (element.length > 1) {
    descriptionText = 'Got ' + element.length + ' elements.';
  }
  return [element, descriptionText];
}

console.log(countAndDescribe(['Sports', 'Cooking']));

//Example:3 gurantee that second parameter would be any key of first - ensure we will not access property that does not exist

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return 'Value: ' + obj[key];
}

extractAndConvert({ name: 'Max' }, 'name');

//- - - - Generic Classes - maybe i want to have different staorages  

class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1); // -1
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Max');
textStorage.addItem('Manu');
textStorage.removeItem('Max');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// const maxObj = {name: 'Max'};
// objStorage.addItem(maxObj);
// objStorage.addItem({name: 'Manu'});
// // ...
// objStorage.removeItem(maxObj);
// console.log(objStorage.getItems());















