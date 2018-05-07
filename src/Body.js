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
    constructor(props) {
        super(props);
        this.state = { count: 20, category: "Steakhouses" };
    }
    render() {
        const { categories } = this.props;
        const { count, category } = this.state;

        let variables = { category, size: count };
        return (
            <div className="score" style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div>
                    <select
                        value={category}
                        onChange={e => {
                            this.setState({ category: e.target.value });
                        }}>
                        {categories.map(
                            d => <option key={d.Key}>{d.Key}</option> //Key is the name of the category
                        )}
                    </select>
                </div>
                <div style={{ display: "flex", width: "100%", flex: "1" }}>
                    <div style={{ border: "solid 1px black", width: "300px" }}>
                        <input
                            type="number"
                            value={count}
                            onChange={e => {
                                this.setState({ count: e.target.value });
                            }}
                        />
                    </div>
                    <div style={{ border: "solid 1px black", flex: "1" }}>
                        <Query query={loadData} variables={variables}>
                            {result => {
                                const { data } = result;
                                if (!data.Dataset) return <div>Loading</div>; //Checking if the data is loaded

                                //Display Keywords
                                return <div>{data.Dataset.Keywords.Values.map(d => <div key={d.Key}>{d.Key}</div>)}</div>;
                            }}
                        </Query>
                    </div>
                </div>
            </div>
        );
    }
}

export default Body;

/*
<div>
<div>
  
</div>
</div> */
