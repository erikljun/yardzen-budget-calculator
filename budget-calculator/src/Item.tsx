import React from 'react';

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
  selectedItem,
}: ItemListProps): JSX.Element {
  const itemList = items.map((item) => {
    return (
      <li key={item.id}>
        <input
          type="radio"
          name={item.type}
          checked={item.id === selectedItem?.id}
          onClick={() => onItemSelected(type, item)}
          readOnly
        />
        <Item
          type={item.type}
          name={item.name}
          lowPrice={item.lowPrice}
          highPrice={item.highPrice}
          id={item.id}
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
    <div className="row">
      <ol>{itemGroupElements}</ol>
    </div>
  );
}
