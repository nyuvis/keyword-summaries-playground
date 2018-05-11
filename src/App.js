import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./App.css";

//import Body from "./scores";
import Body from "./Body";

//Query to get list of categories
const basicData = gql`
    query basicData {
        Dataset(ID: 19) {
            Select {
                Size
                Categories: Values(field: "categories", size: 20) {
                    Key
                }
            }
        }
    }
`;

class App extends Component {
    render() {
        return (
            <Query query={basicData}>
                {result => {
                    const { data } = result;
                    if (!data.Dataset) return <div>Loading</div>; //Checking if the data is loaded

                    return <Body categories={data.Dataset.Select.Categories} />; //Returning the Body.js component
                }}
            </Query>
        );
    }
}

export default App;
