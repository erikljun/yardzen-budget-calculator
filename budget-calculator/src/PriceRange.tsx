import React from 'react';
import { ItemProps } from './Item';

const ON_BUDGET = 'Congrats your budget is within the price range!';
const OVER_BUDGET = 'Woah there big spender, you still need to eat!';
const UNDER_BUDGET =
  'Nice you are still under budget! Go buy some more things!';

interface PriceRangeProps {
  budget: number;
  selectedItems: Map<string, ItemProps>;
}

interface BudgetMessageProps {
  budget: number;
  lowPrice: number;
  highPrice: number;
}

export function PriceRange({
  budget,
  selectedItems,
}: PriceRangeProps): JSX.Element {
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
      <h2>Budget: ${budget}</h2>
      <h2>Price Range:</h2>
      <h3>
        ${lowPrice / 100} - ${highPrice / 100}
      </h3>
      <BudgetMessage
        budget={budget}
        lowPrice={lowPrice}
        highPrice={highPrice}
      />
    </div>
  );
}

function BudgetMessage({
  budget,
  lowPrice,
  highPrice,
}: BudgetMessageProps): JSX.Element {
  if (budget < lowPrice / 100) {
    return <h4>{OVER_BUDGET}</h4>;
  }
  if (budget > highPrice / 100) {
    return <h4>{UNDER_BUDGET}</h4>;
  }
  return <h4>{ON_BUDGET}</h4>;
}
