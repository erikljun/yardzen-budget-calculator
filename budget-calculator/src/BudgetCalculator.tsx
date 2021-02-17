import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import StickyBox from 'react-sticky-box';
import { Subject } from 'rxjs';

import BudgetInput from './BudgetInput';
import { ItemGroupProps, ItemProps, ItemTypes } from './Item';
import { PriceRange } from './PriceRange';
import './App.css';

// collection names
const ITEMS_COLLECTION = 'items';
const RESPONSE_COLLECTION = 'erikLjungmanBudgetResponses';

interface BudgetCalculatorState {
  items: ItemGroupProps[]; // List of all item groups
  budget: number | undefined; // Budget entered by the user
  selectedItems: Map<string, ItemProps>; // Map of item type to selected item of that type
  submitted: boolean; // True if user has submitted their selections
}

/**
 * Main component of the BudgetCalculator
 */
export default class BudgetCalculator extends React.Component<
  any,
  BudgetCalculatorState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: [],
      budget: undefined,
      selectedItems: new Map(),
      submitted: false,
    };

    this.handleSubmitBudget = this.handleSubmitBudget.bind(this);
    this.handleItemSelected = this.handleItemSelected.bind(this);
    this.handleSubmitSelections = this.handleSubmitSelections.bind(this);
  }

  /**
   * Queries the 'items' collection, removes any duplicates, groups them by type
   * and sorts the items within each group by price, then updates the state of the
   * component with the budget and items
   *
   * @param budget budget entered by user
   */
  handleSubmitBudget(budget: number) {
    const firebaseApp = firebase.apps[0];
    const db = firebase.firestore(firebaseApp);

    const itemsByType: Map<string, ItemGroupProps> = new Map();

    db.collection(ITEMS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          const item = doc.data() as ItemProps;
          item.id = doc.id;

          // group items and filter out duplicates
          if (!itemsByType.has(item.type)) {
            itemsByType.set(item.type, {
              items: [item],
              type: item.type,
              onItemSelected: this.handleItemSelected,
            });
          } else if (
            !itemsByType.get(item.type)?.items.some((i) => i.name === item.name) // filter out any duplicates
          ) {
            itemsByType.get(item.type)?.items.push(item);
          }
        });

        // sort items by price
        const sortedItems = Array.from(itemsByType.values());
        sortedItems.forEach((itemList) => {
          itemList.items.sort(
            (item1, item2) => item1.lowPrice - item2.lowPrice,
          );
        });

        // update state
        this.setState({ items: sortedItems, budget });
      });
  }

  /**
   * Updates the selectedItems state variable, either removing the item from the
   * map if it is already selected or adding it to the map if it is not
   *
   * @param type Item type
   * @param item Item selected
   */
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

  /**
   * Deletes all documents from the response collection and then adds all the
   * selected items. Updates the submitted state
   */
  handleSubmitSelections() {
    const firebaseApp = firebase.apps[0];
    const db = firebase.firestore(firebaseApp);
    const batch = firebase.firestore(firebaseApp).batch();

    const { selectedItems } = this.state;

    const docsDeletedObservable = new Subject<boolean>();

    // delete all documents from the response collection
    db.collection(RESPONSE_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        batch.commit().then(() => docsDeletedObservable.next(true));
      });

    // add all selected items to the response collection
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
        {/* Prompt the user to enter a budget if no budget entered yet */}
        {!budget && !submitted && (
          <BudgetInput onSubmit={this.handleSubmitBudget} />
        )}

        {/* Display the items and the price range when budget has been entered */}
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

        {/* Thank user for selections once they are submitted */}
        {submitted && (
          <h2 className="center">Thank you for your selections!</h2>
        )}
      </div>
    );
  }
}
