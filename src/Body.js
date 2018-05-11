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
            Noise: Select {
                Values(field: "text", size: $size) {
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
        const { count, category, order, clas, group, noise } = this.state;

        console.log(this.state);

        let variables = { category, size: count, order, clas, group, noise };

        return (
            <div className="score" style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div>
                    <label className="Categories"> Categories </label>
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
                        <div className="Section-title"> Dimensions </div>
                        <label>
                            {" "}
                            <b>NUMBER</b>{" "}
                        </label>
                        <input
                            type="number"
                            value={count}
                            onChange={e => {
                                this.setState({ count: e.target.value });
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
                                    this.setState({ order: e.target.value });
                                }}>
                                <option value="Alphabetical">Alphabetical</option>
                                <option value="Random">Random</option>
                                <option value="Score">Score</option>
                                <option value="Frequency">Frequency</option>
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
                                    this.setState({ clas: e.target.value });
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
                                    this.setState({ group: e.target.value });
                                }}>
                                <option value="Single words"> Single words</option>
                                <option value="Bi-grams">Bi-grams</option>
                            </select>
                        </div>

                        <div title="NOISE">
                            <label>
                                <b>NOISE </b>
                            </label>
                            <div class="slidecontainer">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    class="slider"
                                    id="myRange"
                                    value={noise}
                                    onChange={e => {
                                        this.setState({ noise: e.target.value });
                                    }}
                                />
                                {noise}
                            </div>
                        </div>
                    </div>

                    <div style={{ border: "solid 1px black", flex: "1" }}>
                        <div className="Section-title"> Keywords </div>
                        <Query query={loadData} variables={variables}>
                            {result => {
                                const { data } = result;
                                console.log(data);
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
