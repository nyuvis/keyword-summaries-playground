import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

class Score extends Component {
    render() {
        return (
            <div className="score">
            <p> style={{ color: "red" }}> scores </p>
            </div>
        );
    }
}

export default Score;


