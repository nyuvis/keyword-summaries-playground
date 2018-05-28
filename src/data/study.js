import React, { PureComponent } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { orderBy, sortBy, random, shuffle } from "lodash";
import { extent } from "d3-array";

const loadData = gql`
    query getData($category: [String], $count: Int) {
        Dataset(ID: 19) {
            Keywords: Select(filter: { field: "categories", in: $category }) {
                Size
                Values(field: "text", discriminant: true, size: $count) {
                    Key
                    Score
                    Count
                }
            }
            Noise: Select {
                Size
                Values(field: "text", size: $count) {
                    Key
                    Score
                    Count
                }
            }
        }
    }
`;

class Body extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            realtime: true,
            inputs: {
                count: 20,
                category: "Steakhouses",
                discriminant: true,
                order: "Key",
                noise: 0
            }
        };
        this.state.variables = this.state.inputs;
    }

    setVariable(name, value) {
        let newState = { inputs: { ...this.state.inputs, [name]: value } };
        if (this.state.realtime) {
            console.log("Updating Variables");
            newState.variables = { ...newState.inputs };
        }
        this.setState(newState);
    }

    render() {
        const { categories } = this.props;
        const { count, category, order, clas, group, noise } = this.state.inputs;
        let categoriesList = ["Chinese", "American", "Japanese"];

        console.log(this.state);

        let variables = this.state.variables;

        return (
            <div>
                <div>
                    {this.props.category} - {this.props.noise}
                </div>
                <div style={{ display: "flex", width: "100%", flex: "1" }}>
                    <div style={{ border: "solid 1px black", width: "300px" }}>
                        <div className="Section-title"> KEYWORDS </div>

                        <Query query={loadData} variables={variables}>
                            {result => {
                                const { data } = result;
                                console.log(data);
                                if (!data.Dataset) return <div>Loading</div>; //Checking if the data is loaded

                                // Prepare words

                                let keywords = data.Dataset.Keywords.Values;
                                let noise = data.Dataset.Noise.Values;

                                let numKeywords = keywords.length;
                                let numNoise = Math.floor(variables.noise / 100 * numKeywords);
                                numKeywords = numKeywords - numNoise;
                                keywords = keywords.slice(0, numKeywords);
                                console.log(variables.order);
                                if (variables.order !== "Key") {
                                    let valueExtent = extent(keywords, d => d[variables.order]);
                                    noise = noise.map(d => ({
                                        ...d,
                                        [variables.order]: random(...valueExtent)
                                    }));
                                }
                                keywords = [...keywords, ...noise.slice(0, numNoise)];
                                if (variables.order === "Random") {
                                    keywords = shuffle(keywords);
                                } else if (variables.order !== "Key") {
                                    keywords = orderBy(keywords, [variables.order], "desc");
                                } else {
                                    keywords = orderBy(keywords, [variables.order]);
                                }

                                //Display Keywords
                                return <div>{keywords.map(d => <div key={d.Key}>{d.Key}</div>)}</div>;
                            }}
                        </Query>
                    </div>

                    <div style={{ display: "flex", width: "100%", flex: "1" }}>
                        <div style={{ border: "solid 1px black", width: "300px" }}>
                            <div className="Section-title"> CATEGORIES </div>

                            <label> Select a label </label>
                            {categoriesList.map(d => (
                                <div key={d}>
                                    <input type="radio" name="category" className="check" />
                                    <label> {d} </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={() => this.props.next()}> NEXT </button>
            </div>
        );
    }
}

export default Body;
