import {Models} from "@rematch/core";
import { wordpress } from "./models/wordpress";

export interface RootModel extends Models<RootModel> {
    wordpress: typeof wordpress
}

export const models: RootModel = { wordpress }
