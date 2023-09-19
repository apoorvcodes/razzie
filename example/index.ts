import env from "dotenv"
env.config()

import {execute} from "../src/llm"

const run = async () => {
await execute({
    question: "What is the best way to write an essay related to computer science, for harvard?",
    isStreaming: false
})
}

run()