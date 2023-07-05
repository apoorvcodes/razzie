import type { PromptTemplate } from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
export default class Client {
  public condensePrompt: PromptTemplate;
  public questionPrompt: PromptTemplate;
  public vectorStore: HNSWLib;

  constructor(options: {
    condensePrompt: PromptTemplate;
    questionPrompt: PromptTemplate;
    vectorStore: HNSWLib;
  }) {
    this.questionPrompt = options.questionPrompt;
    this.condensePrompt = options.condensePrompt;
    this.vectorStore = options.vectorStore;
  }

  async execute(options: {
    question: string;
    history?: string;
    isStreaming: boolean;
    handleLLMStart?: () => void;
    handleLLmEnd?: () => void;
    handleLLMNewToken?: (v: string) => void;
  }) {
    const questionChain = new ChatOpenAI({});

    const doc = new ChatOpenAI({
      temperature: 0.2,
      frequencyPenalty: 0,
      presencePenalty: 0,
      modelName: "gpt-3.5-turbo",
      streaming: options.isStreaming,
      callbackManager: {
        handleLLMStart: options.handleLLMStart,
        handleLLMEnd: options.handleLLmEnd,
        handleLLMNewToken: options.handleLLMNewToken,
      } as any,
    });

    const client = ConversationalRetrievalQAChain.fromLLM(
      doc,
      this.vectorStore.asRetriever(),
      {
        questionGeneratorChainOptions: {
          llm: questionChain,
          template: String(this.questionPrompt),
        },
      },
    );

    console.log(client.call({
        question: options.question
    }))
  }
}
