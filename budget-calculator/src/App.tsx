import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import StickyBox from 'react-sticky-box';
import { Subject } from 'rxjs';

import BudgetInput from './BudgetInput';
import { ItemListProps, ItemProps, ItemTypes } from './Item';
import { PriceRange } from './PriceRange';
import './App.css';

const ITEMS_COLLECTION = 'items';
const RESPONSE_COLLECTION = 'erikLjungmanBudgetResponses';

interface AppState {
  items: ItemListProps[];
  budget: number | undefined;
  selectedItems: Map<string, ItemProps>;
  submitted: boolean;
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: [],
      budget: undefined,
      selectedItems: new Map(),
      submitted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemSelected = this.handleItemSelected.bind(this);
    this.handleSubmitSelections = this.handleSubmitSelections.bind(this);
  }

  handleSubmit(budget: number) {
    const firebaseApp = firebase.apps[0];
    const db = firebase.firestore(firebaseApp);

    const items: Map<string, ItemListProps> = new Map();

    db.collection(ITEMS_COLLECTION)
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
          } else if (
            !items.get(item.type)?.items.some((i) => i.name === item.name)
          ) {
            items.get(item.type)?.items.push(item);
          }
        });
        const sortedItems = Array.from(items.values());
        sortedItems.forEach((itemList) => {
          itemList.items.sort(
            (item1, item2) => item1.lowPrice - item2.lowPrice,
          );
        });
        this.setState({ items: sortedItems, budget });
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

  handleSubmitSelections() {
    const firebaseApp = firebase.apps[0];
    const db = firebase.firestore(firebaseApp);
    const batch = firebase.firestore(firebaseApp).batch();

    const { selectedItems } = this.state;

    const docsDeletedObservable = new Subject<boolean>();

    db.collection(RESPONSE_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        batch.commit().then(() => docsDeletedObservable.next(true));
      });

    docsDeletedObservable.subscribe((deleted) => {
      if (deleted) {
        selectedItems.forEach((item) => {
          db.collection(RESPONSE_COLLECTION).add(item);
        });
        docsDeletedObservable.unsubscribe();
        this.setState({ submitted: true });
      }
    });
  }

  render() {
    const { items, budget, selectedItems, submitted } = this.state;

    return (
      <div className="height-100">
        {submitted && (
          <h2 className="center">Thank you for your selections!</h2>
        )}
        {!budget && !submitted && <BudgetInput onSubmit={this.handleSubmit} />}
        {budget && !submitted && (
          <div className="row">
            <div>
              <ItemTypes itemGroups={items} selectedItems={selectedItems} />
            </div>
            <div className="sticky-box">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <div>
                  <PriceRange
                    budget={budget}
                    selectedItems={selectedItems}
                    onSubmit={this.handleSubmitSelections}
                  />
                </div>
              </StickyBox>
            </div>
          </div>
        )}
      </div>
    );
  }
}
