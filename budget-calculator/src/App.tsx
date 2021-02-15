import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import BudgetInput from './BudgetInput';
import { Item, ItemList, ItemListProps, ItemProps, ItemTypes } from './Item';

interface AppState {
  items: ItemListProps[];
  budget: number | undefined;
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = { items: [], budget: undefined };
    this.handleSubmit = this.handleSubmit.bind(this);
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
            });
          } else {
            items.get(doc.data().type)?.items.push(doc.data() as ItemProps);
          }
        });
        this.setState({ items: Array.from(items.values()), budget });
      });
  }

  render() {
    const { items, budget } = this.state;

    return (
      <div>
        {!budget && <BudgetInput onSubmit={this.handleSubmit} />}
        {budget && <ItemTypes itemGroups={items} />}
      </div>
    );
  }
}
