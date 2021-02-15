import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import BudgetInput from './BudgetInput';
import { Item, ItemList, ItemListProps, ItemProps, ItemTypes } from './Item';

interface AppState {
  items: ItemListProps[];
  budget: number | undefined;
  selectedItems: Map<string, ItemProps>;
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = { items: [], budget: undefined, selectedItems: new Map() };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemSelected = this.handleItemSelected.bind(this);
  }

  handleSubmit(budget: number) {
    const firebaseApp = firebase.apps[0];
    const db = firebase.firestore(firebaseApp);

    const items: Map<string, ItemListProps> = new Map();

    db.collection('items')
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          if (!items.has(doc.data().type)) {
            items.set(doc.data().type, {
              items: [doc.data() as ItemProps],
              type: doc.data().type,
              onItemSelected: this.handleItemSelected,
            });
          } else {
            items.get(doc.data().type)?.items.push(doc.data() as ItemProps);
          }
        });
        this.setState({ items: Array.from(items.values()), budget });
      });
  }

  handleItemSelected(type: string, item: ItemProps) {
    const { selectedItems } = this.state;
    const updatedSelection = new Map(selectedItems);
    updatedSelection.set(type, item);
    this.setState({ selectedItems: updatedSelection });
  }

  render() {
    const { items, budget, selectedItems } = this.state;

    return (
      <div>
        {!budget && <BudgetInput onSubmit={this.handleSubmit} />}
        {budget && (
          <div>
            <PriceRange selectedItems={selectedItems} />
            <ItemTypes itemGroups={items} />
          </div>
        )}
      </div>
    );
  }
}

interface PriceRangeProps {
  selectedItems: Map<string, ItemProps>;
}

function PriceRange({ selectedItems }: PriceRangeProps): JSX.Element {
  let lowPrice = 0;
  let highPrice = 0;

  selectedItems.forEach((item) => {
    if (item !== undefined) {
      lowPrice += item.lowPrice;
      highPrice += item.highPrice;
    }
  });

  return (
    <div>
      <h2>Price Range:</h2>
      <h3>
        ${lowPrice / 100} - ${highPrice / 100}
      </h3>
    </div>
  );
}
