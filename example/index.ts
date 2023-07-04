import { config } from "dotenv";
config()

import {setupHNSWLib} from "../src";


setupHNSWLib("/example/docs/clockwork", "data")