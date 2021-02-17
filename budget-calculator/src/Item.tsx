import React from 'react';
import './App.css';

// Map of item name to associated image
const ITEM_IMAGES: Map<string, string> = new Map([
  ['Fountain', 'fountain.jpg'],
  ['Pool', 'pool.jpg'],
  ['Taj Mahal', 'taj-mahal.jpg'],
  ['Pirate Ship', 'pirate-ship.jpg'],
  ['Pergola', 'pergola.jpg'],
  ['3-5', 'lighting3.jpg'],
  ['6-15', 'lighting6.jpg'],
  ['16+', 'lighting16.jpg'],
  ['Gravel', 'gravel.jpeg'],
  ['Turf', 'turf.jpg'],
  ['Pavers', 'pavers.jpg'],
  ['Composite', 'composite.jpg'],
  ['Redwood', 'redwood.jpg'],
  ['Plywood Fence', 'plywood.jpg'],
  ['Bamboo Shroud', 'bamboo.jpg'],
  ['Redwood Fence', 'redwood-fence.jpg'],
]);

// Map of item type to displayed text
const ITEM_TYPES: Map<string, string> = new Map([
  ['WATER_FEATURES', 'Water Features'],
  ['STRUCTURES', 'Structures'],
  ['LIGHTING', 'Lighting'],
  ['GROUND_COVER', 'Ground Cover'],
  ['DECK_MATERIAL', 'Deck Material'],
  ['FENCING_AND_PRIVACY', 'Fencing and Privacy'],
]);

// Item data
export interface ItemProps {
  type: string;
  name: string;
  lowPrice: number;
  highPrice: number;
  id: string;
}

// Group of items of a certain type
export interface ItemGroupProps {
  items: ItemProps[];
  type: string;
  onItemSelected: (type: string, item: ItemProps) => void;
  selectedItem?: ItemProps;
}

interface ItemTypesProps {
  itemGroups: ItemGroupProps[];
  selectedItems: Map<string, ItemProps>;
}

/**
 * Displays the name, price range and image for an item
 */
export function Item({ name, lowPrice, highPrice }: ItemProps): JSX.Element {
  return (
    <div>
      <h4 className="center-h">{name}</h4>
      <img src={ITEM_IMAGES.get(name)} alt="" width="200px" height="200px" />
      <h5 className="pt-2">
        ${lowPrice / 100} - ${highPrice / 100}
      </h5>
    </div>
  );
}

/**
 * Displays the type of the item and all the items of that type
 */
export function ItemGroup({
  items,
  type,
  onItemSelected,
  selectedItem,
}: ItemGroupProps): JSX.Element {
  // Array of <li> elements for each item
  const itemList = items.map((item) => {
    // style based on if item is selected
    const divClass = `${
      item.id === selectedItem?.id ? 'item-selected' : 'item'
    }`;

    return (
      <li key={item.id} className="horiz mx-10">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onItemSelected(type, item)}
          onKeyDown={(event) => {
            // only select item if Enter button pressed
            if (event.key === 'Enter') {
              onItemSelected(type, item);
            }
          }}
          className={divClass}
        >
          <Item
            type={item.type}
            name={item.name}
            lowPrice={item.lowPrice}
            highPrice={item.highPrice}
            id={item.id}
          />
        </div>
      </li>
    );
  });

  return (
    <div>
      <h3 className="center-h py-2">{ITEM_TYPES.get(type)}</h3>
      <ul className="center-h">{itemList}</ul>
    </div>
  );
}

/**
 * Displays a list of each item group
 */
export function ItemTypes({
  itemGroups,
  selectedItems,
}: ItemTypesProps): JSX.Element {
  // Array of <li> elements for each type
  const itemGroupElements = itemGroups.map((itemList) => {
    return (
      <li key={itemList.type} className="item-group">
        <ItemGroup
          items={itemList.items}
          type={itemList.type}
          onItemSelected={itemList.onItemSelected}
          selectedItem={selectedItems.get(itemList.type)}
        />
      </li>
    );
  });

  return (
    <div className="px-4">
      <ul>{itemGroupElements}</ul>
    </div>
  );
}
