import React from 'react';

export interface ItemProps {
  type: string;
  name: string;
  lowPrice: string;
  highPrice: string;
}

export interface ItemListProps {
  items: ItemProps[];
  type: string;
}

interface ItemTypesProps {
  itemGroups: ItemListProps[];
}

export function Item({
  type,
  name,
  lowPrice,
  highPrice,
}: ItemProps): JSX.Element {
  return (
    <ol>
      <li>Type: {type}</li>
      <li>Name: {name}</li>
      <li>Low Price: {lowPrice}</li>
      <li>High Price: {highPrice}</li>
    </ol>
  );
}

export function ItemList({ items, type }: ItemListProps): JSX.Element {
  const itemList = items.map((item) => {
    return (
      <li>
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
        <ItemList items={itemList.items} type={itemList.type} />
      </li>
    );
  });
  return (
    <div>
      <ol>{itemGroupElements}</ol>
    </div>
  );
}
