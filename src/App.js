import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Body from "./Body";

const datasetID = 2;

//Query to get list of categories
const basicData = gql`
  query basicData($id: ID) {
    Dataset(ID: $id) {
      Select {
        Size
        Categories: Values(field: "categories", size: 50) {
          Key
        }
      }
    }
  }
`;

class App extends Component {
  render() {
    let variables = {
      id: datasetID
    };
    return (
      <Query query={basicData} variables={variables}>
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
