import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { shuffle } from "lodash";
import "./App.css";

import Body from "./Body";
//import Body from "./data/study";

//Query to get list of categories
const basicData = gql`
    query basicData {
        Dataset(ID: 24) {
            Select {
                Size
                Categories: Values(field: "categories", size: 600) {
                    Key
                    Count
                }
            }
        }
    }
`;

let noise = shuffle([1, 2, 3, 4, 5]);
let categories = shuffle(["Restaurants", "Dealership", "Airport"]);

class App extends Component {
    constructor() {
        super();

        this.state = {
            step: 0,
            category: [categories[0]],
            noise: noise[0]
        };
    }
    next = state => {
        let step = this.state.step + 1;
        this.setState({
            step: step,
            category: [categories[step]],
            noise: noise[step]
        });
    };
    render() {
        return (
            <div>
                <Query query={basicData}>
                    {result => {
                        const { data } = result;
                        if (!data.Dataset) return <div>Loading</div>; //Checking if the data is loaded

                        return <Body category={this.state.category} next={this.next} noise={this.state.noise} categories={data.Dataset.Select.Categories} />; //Returning the Body.js component
                    }}
                </Query>
            </div>
        );
    }
}

export default App;
