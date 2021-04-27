import React, { Component } from 'react';
import './App.css';
import {getOrders} from '../../apiCalls';
import Orders from '../../components/Orders/Orders';
import OrderForm from '../../components/OrderForm/OrderForm';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      orders: []
    }
  }

  updateOrders = (newOrder) => {
    this.setState({ orders: [...this.state.orders, newOrder ]})
  }

  componentDidMount() {
    getOrders()
      .then(data => {
        this.setState({ orders: data.orders })
      })
      .catch(err => console.error('Error fetching:', err));
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>Burrito Builder</h1>
          <OrderForm updateOrders={ this.updateOrders }/>
        </header>

        <Orders orders={ this.state.orders } />
      </main>
    );
  }
}


export default App;
