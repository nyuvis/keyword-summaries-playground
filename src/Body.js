import React, { PureComponent } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/github";
import { sortBy, random } from "lodash";
import { extent } from "d3-array";

const loadData = gql`
  query getData($category: [String], $number: Int, $discriminant: Boolean) {
    Dataset(ID: 2) {
      Select {
        Values(field: "text", size: $number) {
          Key
          Score
          Count
        }
      }
      Keywords: Select(filter: { field: "categories", in: $category }) {
        Size
        Values(field: "text", discriminant: $discriminant, size: $number) {
          Key
          Score
          Count
        }
      }
    }
  }
`;

class Body extends PureComponent {
  constructor() {
    super();
    this.state = {
      params: {
        number: 20,
        discriminant: true,
        category: "Italian",
        sortby: "Key",
        noise: 0
      }
    };
  }
  onChange = (value, v3, c, d) => {
    try {
      let params = JSON.parse(value);
      this.setState({
        params: params
      });
    } catch (error) {
      console.log("Invalid");
    }
  };
  render() {
    const { categories } = this.props;
    const { params } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <div>
          <select
            value={this.state.params.category}
            onChange={e =>
              this.setState({
                params: { ...this.state.params, category: e.target.value }
              })
            }
          >
            {sortBy(categories, "Key").map(
              d => <option key={d.Key}>{d.Key}</option> //Key is the name of the category
            )}
          </select>
        </div>
        <div style={{ display: "flex", flex: "1" }}>
          <div>
            <AceEditor
              mode="json"
              value={JSON.stringify(this.state.params, null, 4)}
              theme="github"
              name="UNIQUE_ID_OF_DIV"
              debounceChangePeriod={1000}
              editorProps={{ $blockScrolling: true }}
              onChange={this.onChange}
            />
          </div>
          <div style={{ overflow: "auto" }}>
            <Query query={loadData} variables={this.state.params}>
              {result => {
                const { data } = result;
                if (!data.Dataset) return <div>Loading</div>; //Checking if the data is loaded

                //Prepare Words
                let keywords = data.Dataset.Keywords.Values;
                let noise = data.Dataset.Select.Values;

                let numKeywords = keywords.length;
                let numNoise = Math.floor(params.noise * numKeywords);
                numKeywords = numKeywords - numNoise;
                keywords = keywords.slice(0, numKeywords);
                if (params.sortby !== "Key") {
                  let valueExtent = extent(keywords, d => d[params.sortby]);
                  noise = noise.map(d => ({
                    ...d,
                    [params.sortby]: random(...valueExtent)
                  }));
                }
                keywords = [...keywords, ...noise.slice(0, numNoise)];

                keywords = sortBy(keywords, [params.sortby]);
                //Display Keywords

                return (
                  <div>{keywords.map(d => <div key={d.Key}>{d.Key}</div>)}</div>
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
