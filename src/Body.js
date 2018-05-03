import React, { PureComponent } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const loadData = gql`
  query getData($category: [String], $size: Int) {
    Dataset(ID: 19) {
      Keywords: Select(filter: { field: "categories", in: $category }) {
        Size
        Values(field: "text", discriminant: true, size: $size) {
          Key
          Stat
        }
      }
    }
  }
`;

class Body extends PureComponent {
  render() {
    const { categories } = this.props;

    return (
      <div>
        <div>
          <select>
            {categories.map(
              d => <option key={d.Key}>{d.Key}</option> //Key is the name of the category
            )}
          </select>
          {/* Load list of keywords----------------------------------------- */}
          <div>
            <Query
              query={loadData}
              variables={{ category: "Steakhouses", size: 20 }}
            >
              {result => {
                const { data } = result;
                if (!data.Dataset) return <div>Loading</div>; //Checking if the data is loaded

                //Display Keywords
                return (
                  <div>
                    {data.Dataset.Keywords.Values.map(d => (
                      <div key={d.Key}>{d.Key}</div>
                    ))}
                  </div>
                );
              }}
            </Query>
          </div>
        </div>
      </div>
    );
  }
}

export default Body;
