import ReactDOM from 'react-dom'; 
import React, { Component } from "react";

class Order extends React.Component {
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Order
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value='alphabetical'>Alphabetical</option>
                    </select>
                </label>
                <input type='order' />
            </form>
        );
        
    }
}

ReactDOM.render(
    <Order />,
    document.getElementById('root')
);

export default Order;