import React from 'react';
import { ItemProps } from './Item';

const ON_BUDGET = 'Congrats your budget is within the price range!';
const OVER_BUDGET = 'Woah there big spender, you still need to eat!';
const UNDER_BUDGET = 'Nice you are still under budget!';

interface PriceRangeProps {
  budget: number;
  selectedItems: Map<string, ItemProps>;
  onSubmit: () => void;
}

interface BudgetMessageProps {
  budget: number;
  lowPrice: number;
  highPrice: number;
}

export function PriceRange({
  budget,
  selectedItems,
  onSubmit,
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
    <div className="budget-box">
      <h4>Budget: ${budget}</h4>
      <h4>
        Price Range: ${lowPrice / 100} - ${highPrice / 100}
      </h4>
      <BudgetMessage
        budget={budget}
        lowPrice={lowPrice}
        highPrice={highPrice}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={onSubmit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSubmit();
          }
        }}
        className="submit-button right-align"
      >
        Submit
      </div>
    </div>
  );
}

function BudgetMessage({
  budget,
  lowPrice,
  highPrice,
}: BudgetMessageProps): JSX.Element {
  if (budget < lowPrice / 100) {
    return <p className="over-budget">{OVER_BUDGET}</p>;
  }
  if (budget > highPrice / 100) {
    return <p>{UNDER_BUDGET}</p>;
  }
  return <p>{ON_BUDGET}</p>;
}
