import React, { PureComponent } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { orderBy, sortBy, random, shuffle } from "lodash";
import { extent } from "d3-array";

const loadData = gql`
    query getData($category: [String], $count: Int) {
        Dataset(ID: 24) {
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

        console.log(this.state);

        let variables = this.state.variables;

        return (
            <div className="score" style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div>
                    <label className="Categories"> Categories </label>
                    <select
                        value={category}
                        onChange={e => {
                            this.setVariable("category", e.target.value);
                        }}>
                        {console.log(categories.map(d => d.Key + "," + d.Count).join("\n")) ||
                            categories.map(
                                d => <option key={d.Key}>{d.Key}</option> //Key is the name of the category
                            )}
                    </select>
                </div>

                <div style={{ display: "flex", width: "100%", flex: "1" }}>
                    <div style={{ border: "solid 1px black", width: "300px" }}>
                        <div className="Section-title"> Dimensions </div>

                        <label>
                            {" "}
                            <b>NUMBER</b>{" "}
                        </label>
                        <input
                            type="number"
                            value={count}
                            onChange={e => {
                                this.setVariable("count", e.target.value);
                            }}
                        />

                        <div title="ORDER">
                            <label>
                                {" "}
                                <b>ORDER</b>{" "}
                            </label>
                            <select
                                id="select"
                                value={order}
                                onChange={e => {
                                    this.setVariable("order", e.target.value);
                                }}>
                                <option value="Key">Alphabetical</option>
                                <option value="Random">Random</option>
                                <option value="Score">Score</option>
                                <option value="Count">Frequency</option>
                            </select>
                        </div>

                        <div title="CLASS">
                            <label>
                                {" "}
                                <b>CLASS </b>
                            </label>
                            <select
                                id="select"
                                value={clas}
                                onChange={e => {
                                    this.setVariable("clas", e.target.value);
                                }}>
                                <option value="Nouns">Nouns</option>
                                <option value="Adjectives">Adjectives</option>
                                <option value="Nouns">Proper nouns</option>
                            </select>
                        </div>

                        <div title="GROUPING">
                            <label>
                                <b> GROUPING </b>
                            </label>
                            <select
                                id="select"
                                value={group}
                                onChange={e => {
                                    this.setVariable("group", e.target.value);
                                }}>
                                <option value="Single words"> Single words</option>
                                <option value="Bi-grams">Bi-grams</option>
                            </select>
                        </div>

                        <div title="NOISE">
                            <label>
                                <b>NOISE </b>
                            </label>
                            <div className="slidecontainer">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="slider"
                                    id="myRange"
                                    value={noise}
                                    onChange={e => {
                                        this.setVariable("noise", e.target.value);
                                    }}
                                />
                                {noise}
                            </div>
                        </div>

                        <div>
                            <div>
                                Auto Update{" "}
                                <input type="checkbox" checked={this.state.realtime} onChange={e => this.setState({ realtime: e.target.checked })} />
                            </div>
                            <button
                                onClick={() => {
                                    this.setState({
                                        variables: { ...this.state.inputs }
                                    });
                                }}>
                                Apply
                            </button>
                        </div>
                    </div>

                    <div style={{ border: "solid 1px black", flex: "1" }}>
                        <div className="Section-title"> Keywords </div>
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
                                    //keywords = orderBy(keywords, [variables.order], "desc");
                                } else {
                                    //keywords = orderBy(keywords, [variables.order]);
                                }

                                //Display Keywords
                                return <div>{keywords.map(d => <div key={d.Key}>{d.Key}</div>)}</div>;
                            }}
                        </Query>
                    </div>
                </div>
            </div>
        );
    }
}

export default Body;
