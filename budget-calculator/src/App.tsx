import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import BudgetInput from './BudgetInput';
import { ItemListProps, ItemProps, ItemTypes } from './Item';
import { PriceRange } from './PriceRange';
import './App.css';

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
          const item = doc.data() as ItemProps;
          item.id = doc.id;
          if (!items.has(item.type)) {
            items.set(item.type, {
              items: [item],
              type: item.type,
              onItemSelected: this.handleItemSelected,
            });
          } else {
            items.get(item.type)?.items.push(item);
          }
        });
        this.setState({ items: Array.from(items.values()), budget });
      });
  }

  handleItemSelected(type: string, item: ItemProps) {
    const { selectedItems } = this.state;
    const updatedSelection = new Map(selectedItems);
    if (item.id !== selectedItems.get(type)?.id) {
      updatedSelection.set(type, item);
    } else {
      updatedSelection.delete(type);
    }
    this.setState({ selectedItems: updatedSelection });
  }

  render() {
    const { items, budget, selectedItems } = this.state;

    return (
      <div className="height-100">
        {!budget && <BudgetInput onSubmit={this.handleSubmit} />}
        {budget && (
          <div>
            <PriceRange budget={budget} selectedItems={selectedItems} />
            <ItemTypes itemGroups={items} selectedItems={selectedItems} />
          </div>
        )}
      </div>
    );
  }
}
