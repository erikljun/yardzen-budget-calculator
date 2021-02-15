import React from 'react';

interface BudgetProps {
  budget: string;
}

interface BudgetState {
  budget: string;
}

export default class BudgetInput extends React.Component<
  BudgetProps,
  BudgetState
> {
  constructor(props: any) {
    super(props);
    this.state = { budget: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({ budget: event.target.value });
  }

  handleSubmit(event: any) {
    const { budget } = this.state;
    alert(`A name was submitted: ${budget}`);
    event.preventDefault();
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
