import React from 'react';

export interface ItemProps {
  type: string;
  name: string;
  lowPrice: number;
  highPrice: number;
}

export interface ItemListProps {
  items: ItemProps[];
  type: string;
  onItemSelected: (type: string, item: ItemProps) => void;
}

interface ItemTypesProps {
  itemGroups: ItemListProps[];
}

export function Item({ name, lowPrice, highPrice }: ItemProps): JSX.Element {
  return (
    <ol>
      <li>Name: {name}</li>
      <li>Low Price: ${lowPrice / 100}</li>
      <li>High Price: ${highPrice / 100}</li>
    </ol>
  );
}

export function ItemList({
  items,
  type,
  onItemSelected,
}: ItemListProps): JSX.Element {
  const itemList = items.map((item) => {
    return (
      <li>
        <input
          type="radio"
          name={item.type}
          onChange={() => onItemSelected(type, item)}
        />
        <Item
          type={item.type}
          name={item.name}
          lowPrice={item.lowPrice}
          highPrice={item.highPrice}
        />
      </li>
    );
  });
  return (
    <div className="column">
      <h2>{type}</h2>
      <ol>{itemList}</ol>
    </div>
  );
}

export function ItemTypes({ itemGroups }: ItemTypesProps): JSX.Element {
  const itemGroupElements = itemGroups.map((itemList) => {
    return (
      <li>
        <ItemList
          items={itemList.items}
          type={itemList.type}
          onItemSelected={itemList.onItemSelected}
        />
      </li>
    );
  });
  return (
    <div className="row">
      <ol>{itemGroupElements}</ol>
    </div>
  );
}
