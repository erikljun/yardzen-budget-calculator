import React from 'react';

interface BudgetProps {
  // budget: number | undefined;
  onSubmit: (budget: number) => void;
}

interface BudgetState {
  budget: number | undefined;
}

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

  handleChange(event: any) {
    this.setState({ budget: event.target.value });
  }

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
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="budgetId">
          <h1>Please enter a budget:</h1>
          <input
            type="text"
            id="budgetId"
            value={budget}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
