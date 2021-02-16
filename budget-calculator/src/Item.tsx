import React from 'react';
import './App.css';

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

export interface ItemProps {
  type: string;
  name: string;
  lowPrice: number;
  highPrice: number;
  id: string;
}

export interface ItemListProps {
  items: ItemProps[];
  type: string;
  onItemSelected: (type: string, item: ItemProps) => void;
  selectedItem?: ItemProps;
}

interface ItemTypesProps {
  itemGroups: ItemListProps[];
  selectedItems: Map<string, ItemProps>;
}

export function Item({ name, lowPrice, highPrice }: ItemProps): JSX.Element {
  return (
    <div>
      <h5 className="center-h">{name}</h5>
      <img src={ITEM_IMAGES.get(name)} alt="" width="200px" height="200px" />
      <h6>
        ${lowPrice / 100} - ${highPrice / 100}
      </h6>
    </div>
  );
}

export function ItemList({
  items,
  type,
  onItemSelected,
  selectedItem,
}: ItemListProps): JSX.Element {
  const itemList = items.map((item) => {
    const divClass = `${
      item.id === selectedItem?.id ? 'item-selected' : 'item'
    }`;
    return (
      <li key={item.id} className="horiz mx-10">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onItemSelected(type, item)}
          onKeyDown={() => onItemSelected(type, item)}
          className={divClass}
          aria-pressed="false"
        >
          <Item
            type={item.type}
            name={item.name}
            lowPrice={item.lowPrice}
            highPrice={item.highPrice}
            id={item.id}
          />
        </div>
        {/* <input
          type="radio"
          name={item.type}
          checked={item.id === selectedItem?.id}
          onClick={() => onItemSelected(type, item)}
          readOnly
        /> */}
      </li>
    );
  });
  return (
    <div>
      <h3 className="center-h">{type}</h3>
      <ul className="center-h">{itemList}</ul>
    </div>
  );
}

export function ItemTypes({
  itemGroups,
  selectedItems,
}: ItemTypesProps): JSX.Element {
  const itemGroupElements = itemGroups.map((itemList) => {
    return (
      <li key={itemList.type}>
        <ItemList
          items={itemList.items}
          type={itemList.type}
          onItemSelected={itemList.onItemSelected}
          selectedItem={selectedItems.get(itemList.type)}
        />
      </li>
    );
  });
  return (
    <div>
      <ul>{itemGroupElements}</ul>
    </div>
  );
}
