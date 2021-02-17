import React from 'react';
import { ItemProps } from './Item';

// Messages for on, over and under budget
const ON_BUDGET = 'Congrats your budget is within the price range!';
const OVER_BUDGET = 'Woah there big spender, you still need to eat!';
const UNDER_BUDGET = 'Nice you are still under budget!';

interface PriceRangeProps {
  budget: number;
  selectedItems: Map<string, ItemProps>; // Map of item type to selected item of that type
  onSubmit: () => void;
}

interface BudgetMessageProps {
  budget: number;
  lowPrice: number;
  highPrice: number;
}

/**
 * Displays the budget, the price range of all selected items, a
 * message whether the budget is under, over, or within the price
 * range and a submit button to submit the selections
 */
export function PriceRange({
  budget,
  selectedItems,
  onSubmit,
}: PriceRangeProps): JSX.Element {
  let lowPrice = 0;
  let highPrice = 0;

  // aggregate the price range from all selections
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

/**
 * Displays a message based on if the budget is over, under or
 * within the price range
 */
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
