This is a `Popover` wrapped component that displays a list of items.

It can handle both single and multi levels of lists.

Most common usage: Skills, Domains.

### Single Level List

```js
import Button from '../Button';
import { Form } from '../Fields';

const singleLevel = [
  { id: 1, name: 'Abruzzenhund' },
  { id: 2, name: 'Affenpinscher' },
  { id: 3, name: 'Afghan Hound' },
  { id: 4, name: 'Africanis' },
  { id: 5, name: 'Aidi' },
  { id: 6, name: 'Ainu Dog' },
  { id: 7, name: 'Airedale Terrier' },
  { id: 8, name: 'Akbash Dog' },
  { id: 9, name: 'Akitas' },
  { id: 10, name: 'Akita (American)' },
  { id: 11, name: 'Akita Inu (Japanese)' },
  { id: 12, name: 'Alano Español' },
  { id: 13, name: 'Alapaha Blue Blood Bulldog' },
  { id: 14, name: 'Alaskan Husky' },
  { id: 15, name: 'Alaskan Klee Kai' },
  { id: 16, name: 'Alaskan Malamute' },
  { id: 17, name: 'Alopekis' },
  { id: 18, name: 'Alpine Dachsbracke' },
  { id: 19, name: 'American Allaunt' },
  { id: 20, name: 'American Alsatian' },
];

<Form
  initialValues={{ itemsList: undefined }}
  onSubmit={values => console.log(values)}
>
  <ItemsList name="itemsList" list={singleLevel} />
  <br />
  <Button text="submit" type="submit" />
</Form>
```

### Multi Level, Nested List

```js
import Button from '../Button';
import { Form } from '../Fields';

const multiLevel = [
  { id: 1, name: 'Metals' },
  { id: 2, name: 'Gases' },
  { id: 3, name: 'Liquids' },
  { id: 10, name: 'Lithium', parent: 1 },
  { id: 11, name: 'Indium', parent: 1 },
  { id: 12, name: 'Gallium', parent: 1 },
  { id: 20, name: 'Hydrogen', parent: 2 },
  { id: 21, name: 'Fluorine', parent: 2 },
  { id: 22, name: 'Argon', parent: 2 },
  { id: 30, name: 'Blood', parent: 3 },
  { id: 31, name: 'Gasoline', parent: 3 },
  { id: 32, name: 'Wine', parent: 3 },
  { id: 300, name: 'O-Negative', parent: 30 },
  { id: 301, name: 'O-Positive', parent: 30 },
  { id: 302, name: 'AB-Negative', parent: 30 },
];

<Form
  initialValues={{ itemsList: undefined }}
  onSubmit={values => console.log(values)}
>
  <ItemsList name="itemsList" list={multiLevel}>
    <span>This is a nested list (click me!)</span>
  </ItemsList>
  <br />
  <Button text="submit" type="submit" />
</Form>
```

### Nullable items list

```jsx
import Button from '../Button';
import { Form } from '../Fields';

const singleLevel = [
  { id: 1, name: 'Abruzzenhund' },
  { id: 2, name: 'Affenpinscher' },
  { id: 3, name: 'Afghan Hound' },
];

<Form
  initialValues={{ itemsList: 2 }}
  onSubmit={values => console.log(values)}
>
  {({ values }) => (
    <>
      <ItemsList list={singleLevel} name="itemsList" nullable>
        <span style={{ fontWeight: 'bold', color: 'blue' }}>Select a hound</span>
      </ItemsList>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <Button type="submit">Submit Hound</Button>
    </>
  )}
</Form>
```