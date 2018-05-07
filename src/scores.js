import React, { Component } from "react";

class Score extends Component {
    render() {
        return (
            <div className="score" style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <label style={{ color: "red" }}> scores </label>
                <div style={{ display: "flex", width: "100%", flex: "1" }}>
                    <div style={{ border: "solid 1px black", width: "300px" }}> home </div>
                    <div style={{ border: "solid 1px black", flex: "1" }}> tree </div>
                </div>
            </div>
        );
    }
}

export default Score;
