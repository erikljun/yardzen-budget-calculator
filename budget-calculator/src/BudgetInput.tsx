import React from 'react';
import './App.css';

interface BudgetProps {
  onSubmit: (budget: number) => void; // fired when user submits a budget
}

interface BudgetState {
  budget: number | undefined;
}

/**
 * Component containing an input for the user to enter their budget and a submit button
 */
export default class BudgetInput extends React.Component<
  BudgetProps,
  BudgetState
> {
  constructor(props: BudgetProps) {
    super(props);
    this.state = { budget: undefined };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Any change to the input updates the state
  handleChange(event: any) {
    this.setState({ budget: event.target.value });
  }

  // Passes on the budget up to BudgetCalculator
  handleSubmit(event: any) {
    const { budget } = this.state;
    const { onSubmit } = this.props;
    if (budget !== undefined) {
      event.preventDefault();
      onSubmit(budget);
    }
  }

  render() {
    const { budget } = this.state;

    return (
      <div className="center">
        <form onSubmit={this.handleSubmit}>
          <div className="center-h">
            <h1>Please enter a budget:</h1>
            <label htmlFor="budgetId">
              $
              <input
                type="text"
                id="budgetId"
                value={budget}
                onChange={this.handleChange}
              />
            </label>
            <input
              type="submit"
              className="submit-button ml-3"
              value="Submit"
            />
          </div>
        </form>
      </div>
    );
  }
}
