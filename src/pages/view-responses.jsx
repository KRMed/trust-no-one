import "./view-responses.css"
import { useState, useEffect } from "react";
import llama3_3 from "../lib/model.js";

export default function ViewResponses() {
  useEffect(() => {
    llama3_3("Who do you think is better Ronaldo or Messi?").then((response) => {
      console.log(response);
    });
  }, []);

  return (
      <h1>View Responses</h1>
    )
}